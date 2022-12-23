const fs = require('node:fs');
const path = require('node:path');
const configPath = path.join(__dirname, '../configs/config.json');

const newGuildConfig = {
    commands: {},
    roles: {}
}

function readConfigFile(){
    return JSON.parse(fs.readFileSync(configPath).toString());
}

function writeConfigFile(config){
    fs.writeFileSync(configPath, JSON.stringify(config));
}

function deleteServerFromConfigFile(guildId){
    let config = readConfigFile();

    if (config[guildId]){
        delete config[guildId];
        // fs.writeFileSync(configPath, JSON.stringify(config));
        writeConfigFile(config);
    }
}

/* ------------------------------------------------------ ROLES    ---------------------------------------------------------------------------- */

function getAutoRole(guildId){
    let config = readConfigFile();

    return config[guildId]["roles"]["autoRole"] || "";
}

function setAutoRole(guildId, roleId){
    let config = readConfigFile();

    config[guildId]["roles"]["autoRole"] = roleId;

    writeConfigFile(config);
}

/* ------------------------------------------------------ COMMANDS ---------------------------------------------------------------------------- */

function writeCommandIdToConfigFile(guildId, commandName, commandId){
    let config = readConfigFile();

    if (!config[guildId]) config[guildId] = newGuildConfig;
    if (!config[guildId]["commands"][commandName]) config[guildId]["commands"][commandName] = {};


    config[guildId]["commands"][commandName]["id"] = commandId;

    // fs.writeFileSync(configPath, JSON.stringify(config));
    writeConfigFile(config);
}

function readCommandIdFromConfigFile(guildId, commandName){
    let guildCommandConfig = readConfigFile()[guildId]["commands"] || {};
    let command = guildCommandConfig[commandName] || {};

    return command["id"] || "";
}

function deleteCommandIdFromConfigFile(guildId, commandName){
    let config = readConfigFile();
    if (config[guildId]["commands"][commandName]){
        delete config[guildId]["commands"][commandName];
        // fs.writeFileSync(configPath, JSON.stringify(config));
        writeConfigFile(config);
    }
}

module.exports = {
    readConfigFile, deleteServerFromConfigFile, getAutoRole, setAutoRole, writeCommandIdToConfigFile, readCommandIdFromConfigFile, deleteCommandIdFromConfigFile
}