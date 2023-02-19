const multer 	= require("multer");
const express 	= require("express");
const imageController = require("../controllers/image.controller")
const auth = require("../controllers/auth.controller");

const upload = multer({
  dest: "./uploads",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"||
      file.mimetype == "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .jpeg and .webp format allowed!"));
    }
  },
  limits: {
	fileSize: 8000000
  }
}).single('file')

function upload_func(req, res, next) {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			console.log("Multer err: ", err.code)
			return res.send(err)
		}
		else if (err && err.message == "Only .png, .jpg, .jpeg and .webp format allowed!") {
			return res.send({code: "FILE_TYPE_ERROR", message: err.message})
		}
		else if (err) {
			console.log("upload err: ", err.message)
			return res.send(err) 
		}
		next()
	})
}

module.exports = (app) => {
	app.use('/api/image/get', express.static('./uploads'))

	app.post("/api/image/upload", auth.verifyToken, upload_func, imageController.upload_image)
}