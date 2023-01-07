const bot = require('./../discord/bot');

function getChannels(guildId) {
    return new Promise((resolve, reject) => {
        try {
            let channels = bot.getChannelList(guildId);
            let formattedChannelList = [];

            channels.forEach(channel => {
                formattedChannelList.push({
                    type: channel.type,
                    id: channel.id,
                    name: channel.name
                })
            })

            resolve(formattedChannelList);
        }catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    getChannels
}