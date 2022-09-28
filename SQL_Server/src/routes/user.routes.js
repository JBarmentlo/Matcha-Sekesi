const auth = require("../controllers/auth.controller");
const searchController = require("../controllers/search.controller");
const userController = require("../controllers/user.controller");
const likeController = require("../controllers/like.controller");
const blockController = require("../controllers/block.controller");

var router = require("express").Router();

router.post("/getallusers"         , auth.verifyToken , searchController.get_all_users     );
router.get ("/getmyuser"           , auth.verifyToken , userController.get_my_user         );
router.post("/updateuser"          , auth.verifyToken , userController.update_user_test    );
router.post("/search_users"        , auth.verifyToken , searchController.search_users      );
router.get ("/getprofile/:username", auth.verifyToken , userController.get_user_by_username);

router.post("/like"                , auth.verifyToken , likeController.like_user           );
router.post("/unlike"              , auth.verifyToken , likeController.un_like_user        );

router.post("/block"               , auth.verifyToken , blockController.block_user         );
router.post("/unblock"             , auth.verifyToken , blockController.un_block_user      );
module.exports = router
