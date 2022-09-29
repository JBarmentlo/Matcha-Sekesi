const auth = require("../controllers/auth.controller");
const chatController = require("../controllers/chat.controller");


var router				= require("express").Router();

router.get("/getall", auth.verifyToken, chatController.get_all_messages)
router.post("/get_conversation", auth.verifyToken, chatController.get_conversation)

module.exports = router