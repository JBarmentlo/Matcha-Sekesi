const multer 	= require("multer");
const express 	= require("express");

const upload = multer({
  dest: "./uploads"
})

module.exports = (app) => {
	app.use('/static', express.static('./uploads'))


	app.post("/api/upload", upload.single('file'), (req, res) => {
	  res.send({file: req.file})
	})	
}

