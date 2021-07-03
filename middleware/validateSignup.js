import User from "../models/user.js";

export default validateSignup = (req, res) => {
  User.findOne({
    userName: req.body.userName,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
  });
};
