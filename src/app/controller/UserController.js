const bcrypt = require('bcrypt');
let User = require('../models/user');

class UserController {
  home(req, res) {
    //res.json(req.user)
    res.render('home', { username: req.user.username });
  }
  profile(req, res, next) {
    // User.findOne({ _id: req.params.id }).then((u) => {
    //   if (u) {
    //     let result;
    //     result = Object.assign(
    //       {},
    //       { username: u.username, email: u.email, dob: u.dob, phone: u.phone }
    //     );
    //     res.send(result);
    //   } else res.status(404).send('not found');
    // });
    res.render('pages/userProfile');
  }
  async findUserWithEmail(emails) {
    await User.find({ email: { $in: emails } }).then((users) => {
      console.log(users);
      return users;
    });
  }
  myProfile(req, res, next) {
    User.findOne({ _id: req.user._id }).then((u) => {
      let result;
      result = Object.assign(
        {},
        { username: u.username, email: u.email, dob: u.dob, phone: u.phone }
      );
      res.send(result);
    });
  }
  logout(req, res) {
    res.clearCookie('token');
    res.send('Logout sc');
  }
  updateProfile(req, res) {
    req.body['updatedAt'] = new Date();
    User.updateOne({ _id: req.user._id }, req.body).then((u) => {
      res.send(u);
    });
  }
  changePassword(req, res, next) {
    bcrypt.compare(password, u.password, function (err, result) {
      if (result) {
        User.findOne({ _id: req.user._id }).then((u) => {
          bcrypt.genSalt(Number(process.env.SALTROUND), function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
              u.password = hash;
              req.body['updatedAt'] = new Date();
              User.updateOne({ _id: req.user._id }, u).then((newUser) => {
                res.send(newUser);
              });
            });
          });
        });
      }
    });
  }
  async follow(req, res, next) {
    console.log(req.user);
    if (req.params.id === req.user._id) res.status(409).send('not found');
    User.findOne({ _id: req.params.id }).then(async (u) => {
      if (u) {
        u.follower.push(req.user._id);
        await u.save();
        req.user.following.push(u._id);
        await User.updateOne({ _id: req.user._id }, req.user);
        res.send('success');
        ``;
      } else res.status(404).send('not found user');
    });
  }
}
module.exports = new UserController();
