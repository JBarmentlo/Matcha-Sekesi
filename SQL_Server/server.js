const express 		= require("express");
const bodyParser 	= require("body-parser");
const cors 			  = require("cors");
const multer 	= require("multer");

require('dotenv').config()

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const userRouter = require("./src/routes/user.routes")
const authRouter = require("./src/routes/auth.routes")


// #######################   USER ROUTES   ########################

app.use('/api/users',userRouter, function(req, res, next){
  res.header(
    "Acces-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
})



// #######################   AUTH ROUTES   ########################

app.use('/api/auth', authRouter, function(req, res, next){
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
}) // auth authentication



// #######################   IMAGE ROUTES   ########################



require("./src/routes/image.routes")(app)


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});