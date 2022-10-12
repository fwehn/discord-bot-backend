const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const commandManager = require('./commandManager');
const commands = commandManager.loadCommands();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!commands[interaction.commandName]){
        interaction.reply({content: "Sorry, aber mein Schöpfer war dumm!", ephemeral: true});
        return;
    }

    await handleCommand(interaction);
});

client.on('guildDelete', guild => {
    commandManager.deleteServerFromConfigFile(guild.id);
});

client.login(process.env.TOKEN).catch(console.error);

function registerCommand(guildId, command){
    return client.application.commands.create(command, guildId);
}

function unregisterCommand(guildId, command){
    return client.application.commands.delete(command, guildId);
}

function getMemberCount(guildId){
    return new Promise((resolve, reject) => {
        client.guilds.cache.find(guild => guild.id === guildId).fetch().then(guild => resolve(guild.approximateMemberCount)).catch(reject);
    });
}

function handleCommand(interaction){
    commands[interaction.commandName]
        .commandCallback(interaction)
        .then((callbackData) => {
            // console.log(callbackData);
            switch (callbackData.type){
                case "public":
                    interaction.reply({content: callbackData.content});
                    break;

                case "private":
                    interaction.reply({content: callbackData.content, ephemeral: true});
                    break;
        //
        //         case "channel":
        //             sendMessageToBotChannel(callbackData.content.announcement);
        //             sendPrivateResponse(interaction, callbackData.content.response);
        //             break;
        //
        //         case "poll":
        //             sendWaiting(interaction);
        //             sendPublicResponse(interaction, callbackData.content)
        //                 .then(msg => {
        //                     getMessage(msg.channel_id, msg.id).then(msg => {
        //                         let emojiList = [`1️⃣`, `2️⃣`,`3️⃣`, `4️⃣`,`5️⃣`, `6️⃣`,`7️⃣`, `8️⃣`,`9️⃣`];
        //                         // let emojiList = [`<:Stonks3:774964846785069096>`, `2️⃣`,`3️⃣`, `4️⃣`,`5️⃣`, `6️⃣`,`7️⃣`, `8️⃣`,`9️⃣`];
        //                         for (let i = 0; i < callbackData.options; i++){
        //                             msg.react(emojiList[i]);
        //                         }
        //                     }).catch(console.error);
        //                 });
        //
        //             break;
        //
                default:
                    interaction.reply({content: callbackData.content, ephemeral: true});
            }
        })
        .catch(err => {
            console.error(err);
            interaction.reply({content: "Mit diesem Command gibt es derzeit Probleme!\nWende dich bitte an unsere Technik!", ephemeral: true});
    });
}

function getServerList(){
    return client.guilds.cache;
}

function sendPrivateMessageToUser(userId, message){
    return client.users.cache.get(userId).send(message);
}

function getScheduledEvents(guildId){
    return new Promise((resolve) => {
        client.guilds.fetch(guildId).then(guild => {
            guild.scheduledEvents.fetch().then(resolve)
        })
    });
}

module.exports = {
    registerCommand, unregisterCommand, getServerList, getMemberCount, sendPrivateMessageToUser, getScheduledEvents
}