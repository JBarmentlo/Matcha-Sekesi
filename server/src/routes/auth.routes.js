const auth = require("../controllers/auth.controller");
const oauth = require("../controllers/oauth.controller");
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
router.get("/oauth"            , oauth.oauthInUp);


module.exports = router