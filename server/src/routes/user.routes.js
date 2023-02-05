const auth = require("../controllers/auth.controller");
const searchController = require("../controllers/search.controller");
const userController = require("../controllers/user.controller");
const likeController = require("../controllers/like.controller");
const consultController = require("../controllers/consult.controller");
const blockController = require("../controllers/block.controller");
const middlewares = require("../controllers/middlewares");

var router = require("express").Router();

router.post("/getallusers"         , auth.verifyToken , searchController.get_all_users        );
router.get ("/getmyuser"           , auth.verifyToken , middlewares.check_mailverified              , userController.get_my_user );
router.post("/updateuser"          , auth.verifyToken , userController.update_user            );
router.post("/search_users"        , auth.verifyToken , middlewares.check_profile_complete    , searchController.search_users);
router.post("/search_users_init"   , auth.verifyToken , searchController.search_users_initial );
router.get ("/getprofile/:username", auth.verifyToken , userController.get_user_by_username   );

router.post("/like"                , auth.verifyToken , likeController.like_user              );
router.post("/unlike"              , auth.verifyToken , likeController.un_like_user           );
router.get ("/getmatches"          , auth.verifyToken , likeController.get_matches            );

router.post("/block"               , auth.verifyToken , blockController.block_user            );
router.post("/report"              , auth.verifyToken , blockController.report_user           );
router.post("/unblock"             , auth.verifyToken , blockController.un_block_user         );

router.get ("/consult/:username"   , auth.verifyToken , consultController.consult_user        );


module.exports = router
