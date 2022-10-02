const express = require('express');
const router = express.Router();
const bot = require('../discord/bot');
const commandController = require('../controller/commandController');
const {basicErrorHandler} = require("../utilityFunctions");

router.get('/', function(req, res) {
    let serverList = {};

    let promiseList = []
    bot.getServerList().forEach(server => {
        serverList[server["id"]] = {
            name: server["name"]
        };
        promiseList.push(bot.getMemberCount(server["id"]).then(count => serverList[server["id"]]["members"] = count));
    });

    Promise.all(promiseList).then(() => {
        res.json(serverList)
    });

});

router.get('/:serverId/commands', (req, res) => {
    let serverId = req.params['serverId'];

    commandController.getCommandsFromServer(serverId).then(data => {
        let activeCommands = Object.keys(data);
        let inactiveCommands = commandController.getCommandNames().filter(name => !activeCommands.includes(name));

        res.status(200).json({active: activeCommands, inactive: inactiveCommands});
    }).catch(err => basicErrorHandler(res, err));
});

module.exports = router;