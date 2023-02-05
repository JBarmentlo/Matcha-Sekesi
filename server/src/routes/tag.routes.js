const auth = require("../controllers/auth.controller");
const tagController = require("../controllers/tag.controller");

var router = require("express").Router();

router.get ("/getall", auth.verifyToken , tagController.get_all_tags);
router.post("/update", auth.verifyToken , tagController.update_user_tags);

module.exports = router
