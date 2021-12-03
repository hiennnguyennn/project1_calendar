var User = require('../models/user');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');

module.exports.requireAuth = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized ');
  }
  jwt.verify(req.cookies.token, 'key', function (err, decoded) {
    if (decoded == undefined) {
      res.status(401).send('Unauthorized ');
    }
    User.findOne({ email: decoded.email }).then((u) => {
      if (!u) {
        res.redirect('/');
        return;
      } else {
        u = u.toObject();
        delete u.password;
        req.user = u;
        next();
      }
    });
  });

  //next();
};
