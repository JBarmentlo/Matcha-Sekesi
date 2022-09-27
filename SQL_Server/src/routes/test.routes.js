const testController = require("../controllers/test.controller");

var router = require("express").Router();

router.post("/createuser", testController.verifyTestModeOn , testController.create_user_test);
router.post("/createtags", testController.verifyTestModeOn , testController.create_user_tags);

module.exports = router
