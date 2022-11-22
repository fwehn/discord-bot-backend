const { Client, GatewayIntentBits} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildScheduledEvents
    ]
});

const commandManager = require('./commandManager');
const commands = commandManager.loadCommands();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!commands[interaction.commandName]){
        interaction.reply({content: "Sorry, aber mein Schöpfer war dumm!", ephemeral: true});
        return;
    }

    await handleCommand(interaction);
});

client.on('guildDelete', guild => {
    commandManager.deleteServerFromConfigFile(guild.id);
});

client.login(process.env.TOKEN).catch(console.error);

function registerCommand(guildId, command){
    return client.application.commands.create(command, guildId);
}

function unregisterCommand(guildId, command){
    return client.application.commands.delete(command, guildId);
}

function getMemberCount(guildId){
    return new Promise((resolve, reject) => {
        client.guilds.cache.find(guild => guild.id === guildId).fetch().then(guild => resolve(guild.approximateMemberCount)).catch(reject);
    });
}

function handleCommand(interaction){
    commands[interaction.commandName]
        .commandCallback(interaction)
        .then((callbackData) => {
            // console.log(callbackData);
            switch (callbackData.type){
                case "public":
                    interaction.reply({content: callbackData.content});
                    break;

                case "private":
                    interaction.reply({content: callbackData.content, ephemeral: true});
                    break;
                default:
                    interaction.reply({content: callbackData.content, ephemeral: true});
            }
        })
        .catch(err => {
            console.error(err);
            interaction.reply({content: "Mit diesem Command gibt es derzeit Probleme!\nWende dich bitte an unsere Technik!", ephemeral: true});
    });
}

function getServerList(){
    return client.guilds.cache;
}

function sendPrivateMessageToUser(userId, message){
    return client.users.cache.get(userId).send(message);
}

function getScheduledEvents(guildId){
    return new Promise((resolve, reject) => {
        resolve(client.guilds.cache.get(guildId).scheduledEvents.cache);
    });
}

function createScheduledEvent(guildId, eventData){
    return client.guilds.cache.get(guildId).scheduledEvents.create(eventData);
}

function deleteScheduledEvent(guildId, eventId){
    return client.guilds.cache.get(guildId).scheduledEvents.delete(eventId);
}

module.exports = {
    registerCommand, unregisterCommand, getServerList, getMemberCount, sendPrivateMessageToUser, getScheduledEvents, createScheduledEvent, deleteScheduledEvent
}