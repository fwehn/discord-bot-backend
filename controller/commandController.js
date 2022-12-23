const bot = require('../discord/bot');
const commandManager = require('../discord/commandManager');
const configManager = require('../discord/configManger');

function getCommandNames(){
    return Object.keys(commandManager.loadCommands());
}

function activateCommand(guildId, commandData){
    return bot.registerCommand(guildId, commandData).then(applicationCommand => configManager.writeCommandIdToConfigFile(guildId, commandData.name, applicationCommand.id));
}

function deactivateCommand(guildId, commandData){
    return bot.unregisterCommand(guildId, configManager.readCommandIdFromConfigFile(guildId, commandData.name)).then(() => configManager.deleteCommandIdFromConfigFile(guildId, commandData.name));
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
            let config = configManager.readConfigFile();
            resolve(config[guildId]["commands"] || {});
        }catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    getCommandNames, activateCommand, deactivateCommand, getCommandData, getCommandsFromServer
}