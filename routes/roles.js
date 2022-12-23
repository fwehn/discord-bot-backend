const express = require("express");
const rolesController = require("../controller/rolesController");
const {basicErrorHandler} = require("../utilityFunctions");
const router = express.Router();

router.get("/autoRole", (req, res) => {
    rolesController.getAutoRole(req["serverId"])
        .then(role => res.status(200).json(role))
        .catch(err => basicErrorHandler(res, err));
});

router.post("/autoRole", (req, res) => {
    rolesController.setAutoRole(req["serverId"], req.body["roleId"])
        .then(() => res.status(201).json({message: "AutoRole saved!"}))
        .catch(err => basicErrorHandler(res, err));
});

module.exports = router;