
const userController = require("../controllers/user.controller.js");
const auth = require("../authentication");
var router = require("express").Router();
// Create a new Tutorial
// router.post("/create", 			userController.create);
// router.get("/checkusername", 	userController.check_username_free);
// router.get("/checkmail", 		userController.check_mail_free);
router.post("/like", 		auth.auth_jwt_token.verifyToken,		userController.like_user)
router.post("/unlike" , 	auth.auth_jwt_token.verifyToken,		userController.unlike_user)

router.get("/likesbyme", 	auth.auth_jwt_token.verifyToken,	 	userController.get_likes_of_user);
router.get("/likesofme", 	auth.auth_jwt_token.verifyToken,	 	userController.get_likes_by_user);
router.get("/islikedbyme/:userId", 	auth.auth_jwt_token.verifyToken,userController.is_liked_by_user);

router.post("/block",  		auth.auth_jwt_token.verifyToken,		userController.block_user);
router.get("/getallblocks", auth.auth_jwt_token.verifyToken,		userController.get_blocks_of_and_by_user);
router.get("/blocksbyme", 	auth.auth_jwt_token.verifyToken,		userController.get_blocks_by_user);
router.get("/blocksofme", 	auth.auth_jwt_token.verifyToken,		userController.get_blocks_of_user);

router.post("/consult", 	auth.auth_jwt_token.verifyToken,		userController.consult_user);
router.get("/consultsofme", auth.auth_jwt_token.verifyToken,		userController.get_consults_of_user);


router.get("/getuser/:userId", 	auth.auth_jwt_token.verifyToken,	userController.get_user_by_id);

router.get("/getmyuser", 	auth.auth_jwt_token.verifyToken,		userController.get_my_user);

router.post("/updateuser", 	auth.auth_jwt_token.verifyToken,		userController.update_user);

router.get("/gettags", 		auth.auth_jwt_token.verifyToken,		userController.get_tags);

router.post("/createuser", 											userController.create_user);

router.get("/getallusers", 	auth.auth_jwt_token.verifyToken,		userController.get_all_users);




// router.get("/getconsults", 	auth.auth_jwt_token.verifyToken,		userController.get_consults_of_user);

// app.use('/api/users', router);

module.exports = router