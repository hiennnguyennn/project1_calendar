var express = require('express')
var cookieParser = require('cookie-parser')
const db= require('./configuration/config')

var router = express.Router()
router.use(cookieParser());

var mongo = require('../database/db');
mongo.connectToServer();

router.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        db = mongo.getDb();
        var query = { username: username, password: password};
        db.collection("account").find(query).toArray(function(err, result) {
          if (err) throw err;
          if (result.length > 0){
              res.render('home', {username: username});
          } else {
              res.render('login', { thongBao: 'Error login, please try again', color: 'red' })
          }
        });
    } 
});

module.exports = router;