const express = require('express');
const router = express.Router();
const {basicErrorHandler} = require("../utilityFunctions");
const eventsController = require('./../controller/eventsController');

//TODO return a list of with events and ids
router.get('/', function(req, res) {
    let serverId = req["serverId"];
    eventsController.getEvents(serverId).then(console.log);
    res.status(200).json({"hello": "world"});
});

router.post('/', (req, res) => {
    let serverId = req["serverId"];

    console.log(req["serverId"], req.body);
    eventsController.createEvent(serverId, req.body)
        .then(() => res.status(201).json({message: "Event created"}))
        .catch(err => basicErrorHandler(res, err));
});

router.delete('/:eventId', (req, res) => {
    let serverId = req["serverId"];
    let eventId = req.params["eventId"];
    console.log(eventId)
    eventsController.deleteEvent(serverId, eventId)
        .then(() => res.status(200).json({message: "Event deleted"}))
        .catch(err => basicErrorHandler(res, err));
});

module.exports = router;