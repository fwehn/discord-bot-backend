const express = require('express');
const router = express.Router();
const commandController = require('../controller/commandController');
const {basicErrorHandler} = require("../utilityFunctions");

router.get('/', function(req, res) {
    let serverId = req['serverId'];
    commandController.getCommandsFromServer(serverId).then(data => {
        let activeCommands = Object.keys(data);
        let inactiveCommands = commandController.getCommandNames().filter(name => !activeCommands.includes(name));

        res.status(200).json({active: activeCommands, inactive: inactiveCommands});
    }).catch(err => basicErrorHandler(res, err));
});

router.post('/activate/:commandName', function(req, res) {
    let serverId = req["serverId"];

    commandController.getCommandData(req.params["commandName"]).then(data => {
        if (req.body["activate"]) {
            commandController.activateCommand(serverId, data).then(() => {
                res.status(200).json({
                    status: 200,
                    message: "Command activated!"
                })
            }).catch(err => basicErrorHandler(res, err));
        } else {
            commandController.deactivateCommand(serverId, data).then(() => {
                res.status(200).json({
                    status: 200,
                    message: "Command deactivated!"
                })
            }).catch(err => basicErrorHandler(res, err));
        }
    }).catch(err => basicErrorHandler(res, err));
});

module.exports = router;