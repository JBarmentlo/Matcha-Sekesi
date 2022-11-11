const auth = require("../controllers/auth.controller");
const chatController = require("../controllers/chat.controller");


var router				= require("express").Router();

router.get("/getall", auth.verifyToken, chatController.get_all_messages)
router.post("/get_conversation", auth.verifyToken, chatController.get_conversation)
router.post("/send_message", auth.verifyToken, chatController.send_message)

module.exports = router
