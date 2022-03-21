const { verify_user_email } = require("../authentication");
const express = require("express")
const router = express.Router()
const auth = require("../controllers/auth.controller");

router.post("/signin", auth.signin);

router.post("/signup", 
    [
        verify_user_email.checkDuplicateUsernameOrEmail
    ],
    auth.signup
)

module.exports = router