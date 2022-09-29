const auth = require("../controllers/auth.controller");
const chatController = require("../controllers/chat.controller");


var router				= require("express").Router();

router.get("/getall", auth.verifyToken, chatController.get_messages)

module.exports = router