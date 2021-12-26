var User = require('../models/user');
var Event = require('../models/event');

module.exports.requireOwn = function (req, res, next) {
  Event.findOne({ _id: req.params.eventId }).then((e) => {
    if (e.userId !== req.user._id) {
      res.status(401).send('Unauthorized ');
    } else {
      next();
    }
  });

  //next();
};
