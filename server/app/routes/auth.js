// const { verify_user_email } = require("../authentication");
// const express = require("express")
// const router = express.Router()
// const auth = require("../controllers/auth.controller");

// router.post("/signin", auth.signin);

// router.post("/signup", 
//   [
//       verify_user_email.checkDuplicateUsernameOrEmail,
//       verify_user_email.checkRolesExisted
//   ],
//   auth.signup
// )

module.exports = app => {
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

	app.use('/api/auth', router, function(req, res, next){
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
  };