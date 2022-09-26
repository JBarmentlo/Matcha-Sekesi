const multer 	= require("multer");
const express 	= require("express");

const upload = multer({
  dest: "./uploads"
})

// TODO Test this
module.exports = (app) => {
	app.use('/static', express.static('./uploads'))

	app.post("/upload", upload.single('file'), (req, res) => {
	  res.send({file: req.file})
	})	
}


