const auth = require("../controllers/auth.controller");
const searchController = require("../controllers/search.controller");
const userController = require("../controllers/user.controller");

var router = require("express").Router();

router.post("/getallusers"   , auth.verifyToken      , searchController.get_all_users );
router.get ("/getmyuser"     , auth.verifyToken      , userController.get_my_user     );
router.post("/updateuser"    , auth.verifyToken      , userController.update_user_test);
router.post("/search_users"    , auth.verifyToken      , searchController.search_users);

module.exports = router
