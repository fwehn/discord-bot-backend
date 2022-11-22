const express = require('express');
const router = express.Router();
const bot = require('../discord/bot');

router.get('/', function(req, res) {
    let serverList = {};
    let promiseList = [];
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

const commandsRouter = require('./commands');
router.use('/:serverId/commands', (req, res, next) => {
    req["serverId"] = req.params["serverId"];
    next();
}, commandsRouter);

const eventsRouter = require('./events');
router.use('/:serverId/events', (req, res, next) => {
    req["serverId"] = req.params["serverId"];
    next();
}, eventsRouter);

const drinksRouter = require('./drinks');
router.use('/:serverId/drinks', (req, res, next) => {
    req["serverId"] = req.params["serverId"];
    next();
}, drinksRouter);

module.exports = router;