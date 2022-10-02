const express = require('express');
const router = express.Router();
const commandController = require('../controller/commandController');
const {basicErrorHandler} = require("../utilityFunctions");

router.get('/', function(req, res) {
    res.json(commandController.getCommandNames());
});

router.post('/activate/:commandName', function(req, res) {
    commandController.getCommandData(req.params["commandName"]).then(data => {
        if (req.body["activate"]) {
            commandController.activateCommand(req.body["guildId"], data).then(data => {
                res.status(200).json({
                    status: 200,
                    message: "Command activated!"
                })
            }).catch(err => basicErrorHandler(res, err));
        } else {
            commandController.deactivateCommand(req.body["guildId"], data).then(data => {
                res.status(200).json({
                    status: 200,
                    message: "Command deactivated!"
                })
            }).catch(err => basicErrorHandler(res, err));
        }
    }).catch(err => basicErrorHandler(res, err));
});

module.exports = router;