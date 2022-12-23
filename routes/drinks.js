const express = require('express');
const router = express.Router();
const drinksController = require("../controller/drinksController");
const {basicErrorHandler} = require("../utilityFunctions");

router.get('/', (req, res) => {
    drinksController.getList(req["serverId"])
        .then(data => {
            let formatted = {};

            for (let i in data){
                let drink = data[i];
                let userId = drink["userId"];

                if (!formatted.hasOwnProperty(userId)) formatted[userId] = [];

                formatted[userId].push({
                    name: drink["name"],
                    amount: drink["amount"],
                    proof: drink["proof"],
                    pure: drink["pure"]
                });
            }

            res.status(200).json(formatted);
        }).catch(err => basicErrorHandler(res, err));
});

router.post('/', (req, res) => {
    drinksController.createDrink(req.body["name"], req.body["amount"], req.body["proof"], req.body["userId"], req["serverId"])
        .then((result) => {
            console.log(result)
            res.status(200).json({message: result["sentence"] || "Funny Sentence!"});
        }).catch(err => basicErrorHandler(res, err));
});

module.exports = router;