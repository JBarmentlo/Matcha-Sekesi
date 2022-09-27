const auth = require("../controllers/auth.controller");
const notifController = require("../controllers/notif.controller");


var router				= require("express").Router();

router.post("/getall", auth.verifyToken, notifController.get_my_notifs)
router.post("/setseen", auth.verifyToken, notifController.set_seen_notifs)
module.exports = router