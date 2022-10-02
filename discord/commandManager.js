const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, '../commands', process.env.ENVIRONMENT);
const configPath = path.join(__dirname, '../configs/commands.json');

let commands = {};
fs.readdirSync(commandsPath).forEach(function(file) {
    let thisFile = require(path.join(commandsPath, file));
    commands[thisFile.commandData.name] = thisFile;
});

function loadCommands(){
    return commands;
}

function readConfigFile(){
    return JSON.parse(fs.readFileSync(configPath).toString());
}

function writeCommandIdToConfigFile(guildId, commandName, commandId){
    let config = readConfigFile();

    if (!config[guildId]) config[guildId] = {};
    if (!config[guildId][commandName]) config[guildId][commandName] = {};


    config[guildId][commandName]["id"] = commandId;

    fs.writeFileSync(configPath, JSON.stringify(config));
}

function readCommandIdFromConfigFile(guildId, commandName){
    let guildConfig = readConfigFile()[guildId] || {};
    let command = guildConfig[commandName] || {};

    return command["id"] || "";
}

function deleteServerFromConfigFile(guildId){
    let config = readConfigFile();

    if (config[guildId]){
        delete config[guildId];
        fs.writeFileSync(configPath, JSON.stringify(config));
    }
}

function deleteIdFromConfigFile(guildId, commandName){
    let config = readConfigFile();
    if (config[guildId][commandName]){
        delete config[guildId][commandName];
        fs.writeFileSync(configPath, JSON.stringify(config));
    }
}

module.exports = {
    loadCommands, readConfigFile, writeCommandIdToConfigFile, readCommandIdFromConfigFile, deleteServerFromConfigFile, deleteIdFromConfigFile
}