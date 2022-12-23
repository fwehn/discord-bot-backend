const commandData = {
    name: "werewolf",
    description: "Spielt eine Runde Werwolf!",
    options: [
        {
            name: "channel",
            description: "Mit wem möchtest du spielen?",
            type: 7,
            required: true
        },
        {
            name: "werewolfs",
            description: "Wie viele Werwölfe braucht ihr?",
            type: 4,
            required: true,
            choices: [
                {
                    name: "1",
                    value: 1
                },
                {
                    name: "2",
                    value: 2
                },
                {
                    name: "3",
                    value: 3
                },
                {
                    name: "4",
                    value: 4
                }
            ]
        },
        {
            name: "1st-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        },
        {
            name: "2nd-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        },
        {
            name: "3rd-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        },
        {
            name: "4th-role",
            description: "Welche Spezial-Rolle möchtet ihr haben?",
            type: 3,
            required: false,
        }
    ]
};

function commandCallback(interaction){
    const {sendPrivateMessageToUser} = require('../discord/bot');

    let options = interaction.options;
    let channel = options.getChannel('channel', true);

    return new Promise((resolve, reject) => {
        if (channel === null || channel === undefined) reject(new Error('Diesen Channel gibt es nicht auf dem Server!'));

        if (channel.type !== 2){
            resolve({type: "private", content: `Wähle bitte einen Voice-Channel aus!`});
        }else{
            // Get number of players and werewolfs
            let werewolfNumber= options.getInteger('werewolfs', true);
            let players = [ ...channel.members.keys() ];

            // Set narrator
            let narrator = interaction.member.user.id;
            if (players.includes(narrator)){
               players.splice(players.indexOf(narrator), 1);
            }

            // Collects all special roles
            let specialRoles = [
                options.getString('1st-role', false),
                options.getString('2nd-role', false),
                options.getString('3rd-role', false),
                options.getString('4th-role', false)
            ].filter(role => role);

            // Check if game is playable
            if (players.length < 5) resolve({type: "private", content: "Es tut mir leid, aber Werwolf macht erst mit mehr als 5 Leuten Spaß!"});
            if ((werewolfNumber + specialRoles.length) >= Math.floor(players.length * .75)) resolve({type: "private", content: `Du solltest bei dieser Spieler-Zahl weniger Werwölfe und Spezial-Rollen auswählen!`});


            // Create narrator-text
            let content = `***Rollen***\n\n`;

            let promiseList = []

            // Distribute special-roles
            if (specialRoles.length > 0){
                for (let i = 0; i < specialRoles.length; i++){
                    let randomPlayer = players[Math.floor(Math.random() * players.length)];
                    players.splice(players.indexOf(randomPlayer), 1);
                    content = content + `${specialRoles[i]}: <@${randomPlayer}>\n`;
                    promiseList.push(sendPrivateMessageToUser(randomPlayer, `Du bist **${specialRoles[i]}**!\n`));
                }
                content = content + `\n`;
            }

            // Distribute werewolfs
            let werewolfs = [];
            for (let i = 0; i < werewolfNumber; i++){
                let randomPlayer = players[Math.floor(Math.random() * players.length)];
                players.splice(players.indexOf(randomPlayer), 1);
                werewolfs.push(randomPlayer);
                content = content + `Werwolf: <@${randomPlayer}>\n`;
            }

            // Contact werewolfs
            for (let i = 0; i < werewolfs.length; i++){
                let otherWolfsArr = werewolfs.slice();
                otherWolfsArr.splice(otherWolfsArr.indexOf(otherWolfsArr[i]), 1);
                let otherWolfsText = "";
                for (let j = 0; j < otherWolfsArr.length; j++){
                    otherWolfsText = otherWolfsText + `<@${otherWolfsArr[j]}>\n`;
                }

                promiseList.push(sendPrivateMessageToUser(werewolfs[i], `Du bist **Werwolf**!\nZusammen mit:\n${otherWolfsText}`));
            }
            content = content + `\n`;

            // Distribute and contact villager
            for (let i = 0; i < players.length; i++){
                promiseList.push(sendPrivateMessageToUser(players[i], `Du bist **Dorfbewohner**!\n`));
                content = content + `Dorfbewohner: <@${players[i]}>\n`;
            }

            Promise.all(promiseList).then(() => {
                resolve({type: "private", content: content});
            }).catch(err => {
                resolve({type: "private", content: "Ich konnte einige Nachrichten leider nicht zustellen!"});
                console.error(err);
            });
        }
    });
}

module.exports = {
    commandData, commandCallback
}