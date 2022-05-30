const express 		= require("express");
const bodyParser 	= require("body-parser");
const cors 			  = require("cors");
require('dotenv').config()

const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require("./app/routes/image.route")(app)

const userRouter = require("./app/routes/user.routes")
const authRouter = require("./app/routes/auth.routes")

app.use('/api/users',userRouter, function(req, res, next){
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
})

app.use('/api/auth', authRouter, function(req, res, next){
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
}) // auth authentication



// console.log(process.env.COMET_APP_KEY)
// console.log(process.env.COMET_APP_ID)
// console.log(process.env.COMET_APP_REGION)
// console.log(process.env.COMET_API_KEY)

// const sdk = require('api')('@cometchat/v3#10yo3ct1l3cvd14i');

// sdk.server(`https://${process.env.COMET_APP_ID}.api-${process.env.COMET_APP_REGION}.cometchat.io/v3/users`);


// sdk['creates-user']({
//   metadata: {
//     '@private': {
//       email: 'user@email.com',
//       contactNumber: '0123456789'
//     }
//   },
//   uid: 'asdawsfsdfffsd',
//   name: 'asdassssssds',
//   withAuthToken: true
// }, {
//   apiKey: process.env.COMET_API_KEY
// })
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});