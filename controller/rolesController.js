const configManager = require('../discord/configManger');

function getAutoRole(guildId){
    return new Promise((resolve, reject) => {
        try {
            resolve(configManager.getAutoRole(guildId));
        }catch (err) {
            reject(err);
        }
    });
}

function setAutoRole(guildId, roleId) {
    return new Promise((resolve, reject) => {
        try {
            configManager.setAutoRole(guildId, roleId);
            resolve();
        }catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    getAutoRole, setAutoRole
}