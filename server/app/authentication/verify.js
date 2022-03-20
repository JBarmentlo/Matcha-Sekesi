const db = require("../newmodels");
// const ROLES = db.ROLES;
const AuthCollection = db.collection("users")

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  AuthCollection.findOne({
    username: req.body.username
  }).then(user => {
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    AuthCollection.findOne({
      mail: req.body.mail
    }).then(user => {
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  })
  .catch(err => {
    res.status(500).send({ message: "Server Error", error: err });
  })
//   next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;