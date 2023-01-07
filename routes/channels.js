const express = require("express");
const channelsController = require("../controller/channelsController");
const {basicErrorHandler} = require("../utilityFunctions");
const router = express.Router();

router.get("/", (req, res) => {
    channelsController.getChannels(req["serverId"])
        .then(channels => res.status(200).json(channels))
        .catch(err => basicErrorHandler(res, err));
});

module.exports = router;