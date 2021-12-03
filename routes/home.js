var router = require("express").Router();

var mongo = require('../database/db');
mongo.connectToServer();
db = mongo.getDb();


router.post('/addEvent', function(req, res) {
    var data = req.body;
    if (data.hasOwnProperty("_id")){
      delete data._id;
    }
    db.collection("event").insertOne(data,function(err, collection) {
      if (err) throw err;
    });
    res.send(true);
});

router.post('/addSubUser', function(req, res) {
    var data = req.body;
    db.collection("subcribe").insertOne(data,function(err, collection) {
      if (err) throw err;
    });
    console.log("insert successful!");
    res.send(true);
});
router.post('/delSubUser', function(req, res) {
    var query = req.body;
    db.collection("subcribe").deleteMany(query);
    console.log("delete successful!");
    res.send(true);
});

router.post('/checkEvent', function(req, res) {
    var query = req.body;
    db.collection("event").find(query).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
    });
});

router.post('/getEvent', function(req, res) {
  var query = req.body;
  db.collection("event").find(query).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

router.post('/getEvents', function(req, res) {
  var query = req.body.ids;
  // console.log(db);
  db.collection("event").find({
    $or: query
  }).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

router.post('/deleteEvent', function(req, res) {
    var id = req.body.id;
    var query = { "id" : id};
    db.collection("event").remove(query);
});

module.exports = router;