const User = require('../models/user');
const Follow = require('../models/follow');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
class SiteController {
  register(req, res) {
    User.findOne({ email: req.body.email }).then((u) => {
      if (u) {
        res.redirect('/register?err=0');
        return;
      } else {
        bcrypt.genSalt(Number(process.env.SALTROUND), function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            req.body.password = hash;
            req.body.dob = new Date(req.body.dob);
            const u = new User(req.body);
            u.save().then(() => {
              const token = jwt.sign(
                {
                  name: u.username,
                  email: u.email,
                },
                'key',
                {
                  expiresIn: '2h',
                }
              );
              res.cookie('token', token);
              res.redirect('/events/list/');
            });
          });
        });
      }
    });
  }
  handleLogin(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
      User.findOne({ email: email }).then((u) => {
        if (u) {
          bcrypt.compare(password, u.password, function (err, result) {
            if (result) {
              const token = jwt.sign(
                {
                  name: u.username,
                  email: u.email,
                },
                'key',
                {
                  expiresIn: '2h',
                }
              );
              res.cookie('token', token);
              console.log(111);
              try {
                res.redirect('/events/list/');
                return;
              } catch (e) {
                console.log(e);
              }
            } else {
              res.redirect('/login?err=0');
              return;
            }
          });
        } else res.redirect('/login?err=0');
      });
    }
  }
  showLogin(req, res, next) {
    res.render('pages/signin');
  }
  showRegister(req, res, next) {
    res.render('pages/signup');
  }
  default(req, res, next) {
    res.render('pages/login');
  }
  // async home(req, res, next) {
  //   const u = await User.findOne({ _id: req.user._id });
  //   let follow = await Follow.find({ user1: req.user._id, status: 1 });

  //   let listFollowing = [];
  //   for (var i = 0; i < follow.length; i++) {
  //     let user = await User.findOne({ _id: follow[i].userId2 });
  //     user = Object.assign(
  //       {},
  //       { username: user.username, _id: user._id, email: user.email }
  //     );
  //     listFollowing.push(user);
  //   }
  //   console.log(listFollowing);
  //   res.redirect('events/list');
  // }
}
module.exports = new SiteController();
