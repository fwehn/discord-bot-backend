const bot = require('./../discord/bot');

function getEvents(guildId){
    return bot.getScheduledEvents(guildId);
}

function createEvent(guildId, eventData){
    return bot.createScheduledEvent(guildId, eventData);
}

function deleteEvent(guildId, eventId){
    return bot.deleteScheduledEvent(guildId, eventId);
}

module.exports = {
    getEvents, createEvent, deleteEvent
}