const auth = require("../controllers/auth.controller");
const searchController = require("../controllers/search.controller");
const userController = require("../controllers/user.controller");

// const userController	= require("../controllers/user.controller.js");
// const notifController	= require("../controllers/notification.controller.js");
// const auth				= require("../authentication");
var router = require("express").Router();

router.post("/getallusers" , auth.verifyToken , searchController.get_all_users );
router.get ("/getmyuser"   , auth.verifyToken , userController.get_my_user     );
router.post("/updateuser"  , auth.verifyToken , userController.update_user_test);

module.exports = router
