const testController = require("../controllers/test.controller");
const middlewares = require("../controllers/middlewares");
const auth = require("../controllers/auth.controller");

var router = require("express").Router();

router.post("/createuser"    , testController.verifyTestModeOn , testController.create_user_test);
router.get ("/getuserlist"   , testController.verifyTestModeOn , testController.get_user_list   );
router.post("/createlikes"   , testController.verifyTestModeOn , testController.create_likes    );
router.post("/createconsults", testController.verifyTestModeOn , testController.create_consults );
router.post("/createblocks"  , testController.verifyTestModeOn , testController.create_blocks   );
router.get("/mm"             , auth.verifyToken, middlewares.mailverified , testController.create_blocks   );
module.exports = router
