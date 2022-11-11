const multer 	= require("multer");
const express 	= require("express");
const imageController = require("../controllers/image.controller")
const auth = require("../controllers/auth.controller");

const upload = multer({
  dest: "./uploads"
})

module.exports = (app) => {
	app.use('/api/image/get', express.static('/home/yup/Code/Web/NEVM-crud-tutorial/SQL_Server/uploads'))

	app.post("/api/image/upload", auth.verifyToken, upload.single('file'), imageController.upload_image)
}