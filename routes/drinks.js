const express = require('express');
const router = express.Router();
const drinksController = require("../controller/drinksController");
const {basicErrorHandler} = require("../utilityFunctions");

router.get('/', (req, res) => {
    //TODO get Data from database and send it back

    // drinksController.getCurrentListId().then(console.log)
    drinksController.createDrink("Bier", 0.2, 5, "242732534432006144", "459426513675223044").then(console.log).catch(console.error);

    res.status(200).json({hello: "world"});
});

router.post('/', (req, res) => {
    //TODO write Data to Database and send Funny sentence Back to User
    drinksController.createDrink(req.body["name"], req.body["amount"], req.body["proof"], req.body["userId"], req["serverId"])
        .then(() => {
            res.status(200).json({message: "Funny Sentence!"});
        }).catch(basicErrorHandler);
});

module.exports = router;