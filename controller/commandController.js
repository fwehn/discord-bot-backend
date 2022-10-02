const bot = require('../discord/bot');
const commandManager = require('../discord/commandManager');

function getCommandNames(){
    return Object.keys(commandManager.loadCommands());
}

function activateCommand(guildId, commandData){
    return bot.registerCommand(guildId, commandData).then(applicationCommand => commandManager.writeCommandIdToConfigFile(guildId, commandData.name, applicationCommand.id));
}

function deactivateCommand(guildId, commandData){
    return bot.unregisterCommand(guildId, commandManager.readCommandIdFromConfigFile(guildId, commandData.name)).then(() => commandManager.deleteIdFromConfigFile(guildId, commandData.name));
}

function getCommandData(commandName){
    return new Promise((resolve, reject) => {
        try {
            resolve(commandManager.loadCommands()[commandName].commandData);
        } catch (err) {
            reject(err);
        }
    });
}

function getCommandsFromServer(guildId){
    return new Promise((resolve, reject) => {
        try {
            let config = commandManager.readConfigFile();
            resolve(config[guildId] || {});
        }catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    getCommandNames, activateCommand, deactivateCommand, getCommandData, getCommandsFromServer
}