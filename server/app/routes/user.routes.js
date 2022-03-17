module.exports = app => {
	const userController = require("../controllers/user.controller.js");
	var router = require("express").Router();
	// Create a new Tutorial
	router.post("/create", 			userController.create);
	router.get("/checkusername", 	userController.check_username_free);
	router.get("/checkmail", 		userController.check_mail_free);
	router.get("/like", 			userController.like_user);
	router.get("/getlikes", 		userController.get_likes_of_user);
	router.get("/block", 			userController.block_user);
	router.get("/getblocks", 		userController.get_blocks_of_and_by_user);
	router.get("/consult", 			userController.consult_user);
	router.get("/login", 			userController.login_user);

	// router.get("/getconsults", 		userController.get_consutls_of_user);
	// Retrieve all Tutorials
	// router.get("/", tutorials.findAll);
	// // Retrieve all published Tutorials
	// router.get("/published", tutorials.findAllPublished);
	// // Retrieve a single Tutorial with id
	// router.get("/:id", tutorials.findOne);
	// // Update a Tutorial with id
	// router.put("/:id", tutorials.update);
	// // Delete a Tutorial with id
	// router.delete("/:id", tutorials.delete);
	// // Create a new Tutorial
	// router.delete("/", tutorials.deleteAll);
	app.use('/api/users', router);
  };