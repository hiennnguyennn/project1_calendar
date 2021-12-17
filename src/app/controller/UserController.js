const bcrypt = require('bcrypt');
let User = require('../models/user');
let Follow = require('../models/follow');

class UserController {
  home(req, res) {
    res.render('home', { username: req.user.username });
  }
  async profile(req, res, next) {
    if (req.query.email === req.user.email) {
      res.status(409).send('You cannot ');
      return;
    }
    let user = await User.findOne({ email: req.query.email });
    if (user) {
      user = user.toObject();
      delete user.password;
      user.dob = user.dob.toISOString().substring(0, 10);
      let follow = await Follow.findOne({
        userId1: req.user._id,
        userId2: user._id,
      });
      if (follow && follow.status == 1)
        res.render('pages/userProfile', { u: user, follow: 1 });
      else res.render('pages/userProfile', { u: user, follow: 0 });
    } else res.status(404).send('not found');
  }
  async findUserWithEmail(emails) {
    await User.find({ email: { $in: emails } }).then((users) => {
      return users;
    });
  }

  async myProfile(req, res, next) {
    let u = (await User.findOne({ _id: req.user._id })).toObject();

    u.dob = u.dob.toISOString().substring(0, 10);
    res.render('pages/myProfile', { u });
  }
  logout(req, res) {
    res.clearCookie('token');
    res.send('Logout sc');
  }
  updateProfile(req, res) {
    req.body['updatedAt'] = new Date();
    User.updateOne({ _id: req.user._id }, req.body).then((u) => {
      res.redirect('/user/me');
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
    const u = await User.findOne({ _id: req.params.id });
    let f = await Follow.findOne({
      userId1: req.user._id,
      userId2: req.params.id,
    });

    if (f) {
      f.status = 1 - f.status;
      await f.save();
    } else {
      let follow = {};
      follow['userId1'] = req.user._id;
      follow['userId2'] = req.params.id;
      follow['status'] = 1;
      follow = new Follow(follow);

      await follow.save();
    }

    res.redirect(`/user?email=${u.email}`);
  }
}
module.exports = new UserController();
