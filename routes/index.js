const express = require('express');
const drinksController = require("../controller/drinksController");
const {basicErrorHandler} = require("../utilityFunctions");
const bot = require("../discord/bot");
const router = express.Router();

router.get('/', function(req, res) {
  bot.getBotInformation()
      .then(data => res.status(200).json(data))
      .catch(err => basicErrorHandler(res, err));
});

router.post('/sentence', (req, res) => {
  drinksController.createSentence(req.body["sentence"])
      .then(() => {
        res.status(200).json({message: "Sentence created!"});
      }).catch(err => basicErrorHandler(res, err));
});

module.exports = router;