const auth = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

// const userController	= require("../controllers/user.controller.js");
// const notifController	= require("../controllers/notification.controller.js");
// const auth				= require("../authentication");
var router				= require("express").Router();

router.post("/signup"          , auth.signup);
router.post("/signin"          , auth.signin);
router.post("/requestpassreset", auth.requestresetPass);
router.post("/verify/:hash"    , auth.verifyMail);
router.post("/passreset"       , auth.resetPass);
router.post("/updateuser"      , auth.verifyToken       , userController.update_user_test);



// router.post("/like", 				auth.auth_jwt_token.verifyToken,		userController.like_user)
// router.post("/unlike" , 			auth.auth_jwt_token.verifyToken,		userController.unlike_user)

// router.get("/likesbyme", 			auth.auth_jwt_token.verifyToken,	 	userController.get_likes_of_user);
// router.get("/likesofme", 			auth.auth_jwt_token.verifyToken,	 	userController.get_likes_by_user);
// router.get("/islikedbyme/:userId", 	auth.auth_jwt_token.verifyToken,		userController.is_liked_by_user);

// router.post("/block",  				auth.auth_jwt_token.verifyToken,		userController.block_user);
// router.get("/getallblocks", 		auth.auth_jwt_token.verifyToken,		userController.get_blocks_of_and_by_user);
// router.get("/blocksbyme", 			auth.auth_jwt_token.verifyToken,		userController.get_blocks_by_user);
// router.get("/blocksofme", 			auth.auth_jwt_token.verifyToken,		userController.get_blocks_of_user);

// router.post("/consult", 			auth.auth_jwt_token.verifyToken,		userController.consult_user);
// router.get("/consultsofme", 		auth.auth_jwt_token.verifyToken,		userController.get_consults_of_user);


// router.get("/getuser/:userId", 		auth.auth_jwt_token.verifyToken,		userController.get_user_by_id);
// router.get("/getmyuser", 			auth.auth_jwt_token.verifyToken,		userController.get_my_user);
// router.post("/updateuser", 			auth.auth_jwt_token.verifyToken,		userController.update_user);
// router.post("/createuser", 													userController.create_user);
// router.get("/getallusers", 			auth.auth_jwt_token.verifyToken,		userController.get_all_users);

// router.get("/getalltags", 			auth.auth_jwt_token.verifyToken,		userController.get_tags);

// router.get("/notifsforme", 			auth.auth_jwt_token.verifyToken,	 	notifController.get_notifs);
// router.post("/notifsetviewed", 		auth.auth_jwt_token.verifyToken,	 	notifController.set_viewed_notif);

// router.get("/getuserauthtoken", 	auth.auth_jwt_token.verifyToken,	 	userController.get_my_user_auth_token);


module.exports = router