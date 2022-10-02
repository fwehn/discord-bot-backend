const {SlashCommandBuilder} = require("discord.js");
const commandData = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!').toJSON();

function commandCallback(interaction){
    return new Promise((resolve) => {
        console.log(interaction)
        resolve({type: "private", content: "Pong!"});
    });
}

module.exports = {
    commandData, commandCallback
}