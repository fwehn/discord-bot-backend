const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, '../commands');

let commands = {};
fs.readdirSync(commandsPath).forEach(function(file) {
    let thisFile = require(path.join(commandsPath, file));
    commands[thisFile.commandData.name] = thisFile;
});

function loadCommands(){
    return commands;
}

module.exports = {
    loadCommands
}