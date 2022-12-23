const axios = require("axios");

const commandData = {
    name: "drinks",
    description: "Gibt eine Liste der Heute getrunkenen Getränke zurück."
}

function commandCallback(interaction){
    let userList = interaction.guild.members.cache;

    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:${process.env.PORT}/server/${interaction.guildId}/drinks`, {headers: {authorization: process.env.API_PASSWORD}})
            .then((res) => {
                if (Object.keys(res.data).length === 0) resolve({type: "private", content: "Heute wurden noch keine Drinks getrunken!\nAlso halt dich ran!"});

                let userData = [];
                let total = 0;
                for (let userId in res.data){
                    let rawDrinks = res.data[userId];
                    let user = {
                        name: userList.get(userId) ? (userList.get(userId).nickname || userList.get(userId).user.username) : userId,
                        pure: 0,
                        drinks: {},
                        string: ""
                    }

                    for (let i in rawDrinks){
                        let curDrink = rawDrinks[i];

                        if (!user["drinks"][curDrink["name"]]){
                            user["drinks"][curDrink["name"]] = 0;
                        }

                        total += curDrink["pure"];
                        user["pure"] += parseFloat(curDrink["pure"].toFixed(4));
                        user["drinks"][curDrink["name"]] += parseFloat(curDrink["amount"].toFixed(4));
                    }

                    let drinksString = "";
                    for (let drink in user["drinks"]){
                        drinksString += `, ${user["drinks"][drink]}l ${drink}`;
                    }

                    user["string"] = drinksString.length > 1026 ? drinksString.substring(2, 1023) + "..." : drinksString.substring(2);
                    userData.push(user);
                }
                userData.sort((a,b) => a["pure"] > b["pure"] ? -1 : 1);

                let fields = Array.from(userData, user => {
                    return {
                        name: user["name"] + ` | ${parseFloat(user["pure"].toFixed(4))}l`,
                        value: user["string"]
                    };
                });

                let fieldChunks = [];
                let chunkSize = 25;
                for (let i = 0; i < fields.length; i += chunkSize){
                    fieldChunks.push(fields.slice(i, i + chunkSize));
                }

                let embeds = [];

                for (let i in fieldChunks){
                    embeds.push({fields: fieldChunks[i]});
                }

                embeds[0].title = "Drinks";
                embeds[0].description = `Derzeit behält **${userData[0]["name"]}** die Führung mit **${parseFloat(userData[0]["pure"].toFixed(4))}l** Alkohol!!!\nHier ist ne genaue Auflistung aller Drinks:\n`;
                embeds[embeds.length-1].footer = {text: `Insgesamt wurden heute ${parseFloat(total.toFixed(4))}l reiner Alkohol getrunken!`};

                resolve({type: "embed", content: embeds});
            }).catch(reject)
    });
}

module.exports = {
    commandData, commandCallback
}
