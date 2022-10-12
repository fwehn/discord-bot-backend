const bot = require('./../discord/bot');

function getEvents(guildId){
    return new Promise((resolve) => {
        bot.getScheduledEvents(guildId).then(resolve);
    });
}

module.exports = {
    getEvents
}