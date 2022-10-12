const express = require('express');
const router = express.Router();

const eventsController = require('./../controller/eventsController');

router.get('/', function(req, res) {
    let serverId = req["serverId"];
    eventsController.getEvents(serverId).then(console.log);
    res.status(200).json({"hello": "world"});
});

module.exports = router;