const { Client, GatewayIntentBits, EmbedBuilder, Events} = require('discord.js');
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
const configManager = require('./configManger');
const commands = commandManager.loadCommands();

client.once(Events.ClientReady, client => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.GuildMemberAdd, member => {
    let autoRole = configManager.getAutoRole(member.guild.id);

    if (autoRole){
        member.roles.add(configManager.getAutoRole(member.guild.id)).catch(console.error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!commands[interaction.commandName]){
        interaction.reply({content: "Sorry, aber mein Schöpfer war dumm!", ephemeral: true});
        return;
    }

    await handleCommand(interaction);
});

client.on(Events.GuildDelete, guild => {
    configManager.deleteServerFromConfigFile(guild.id);
});

client.login(process.env.TOKEN).catch(console.error);

function registerCommand(guildId, command){
    console.log(client, client.application)

    return client.application.commands.create(command, guildId);
}

function unregisterCommand(guildId, command){
    return client.application.commands.delete(command, guildId);
}

function getBotInformation(){
    return new Promise((resolve, reject) => {
        try {
            resolve({
                username: client.user.username
            });
        }catch (e) {
            reject(e);
        }
    })
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

                case "embed":
                    interaction.reply({embeds: Array.from(callbackData.content, (embed) => new EmbedBuilder(embed).setColor(`#71368A`))});
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

function getChannelList(guildId){
    return client.guilds.cache.get(guildId).channels.cache;
}

function sendPrivateMessageToUser(userId, message){
    return client.users.cache.get(userId).send(message);
}

function getScheduledEvents(guildId){
    return new Promise((resolve) => {
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
    registerCommand, unregisterCommand, getServerList, getChannelList, getMemberCount, sendPrivateMessageToUser, getScheduledEvents, createScheduledEvent, deleteScheduledEvent, getBotInformation
}