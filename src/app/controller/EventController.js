let Event = require('../models/event');
let User = require('../models/user');
const Follow = require('../models/follow');
const Moment = require('moment');
const MomentRange = require('moment-range');
const { VirtualType } = require('mongoose');
const { BulkWriteResult } = require('mongodb');
const { events } = require('../models/event');

const moment = MomentRange.extendMoment(Moment);
class EventController {
  createEvent(req, res, next) {
    // req.body.start = new Date(req.body.start);
    // req.body.end = new Date(req.body.end);
    Event.find({ userId: req.user._id }).then((events) => {
      if (events.length > 0) {
        // var range = moment().range(req.body.start, req.body.end);
        for (var i = 0; i < events.length; i++) {
          if (
            (req.body.start > events[i].start &&
              req.body.start > events[i].end) ||
            (req.body.end < events[i].end && req.body.end > events[i].start)
          ) {
            res.status(409).send('conflig');
            return;
          }
        }
      }
      req.body['created_useId'] = req.user._id;
      req.body['userId'] = req.user._id;
      req.body['eventId'] = req.user._id + '' + req.body.start;
      req.body['status'] = 1;
      const e = new Event(req.body);
      e.save().then((e1) => {
        // if (req.body.usersEmail.length > 0) {
        //   User.find({ email: { $in: req.body.usersEmail } }).then(
        //     async (users) => {
        //       if (users.length > 0) {
        //         for (var i = 0; i < users.length; i++) {
        //           req.body['userId'] = users[i]._id;
        //           req.body['status'] = 0;
        //           const x = new Event(req.body);
        //           await x.save();
        //         }
        //       }
        //     }
        //   );
        // }
        res.send(e1);
      });
    });
  }
  async getEvent(req, res, next) {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1;
    let firstDate = new Date(curr.setDate(first));
    firstDate = firstDate.getTime();
    let startOfDay = new Date(firstDate - (firstDate % 86400000));

    let startDate = req.params.date_start || startOfDay.getTime() / 1000 - 86400;
    const endDate = startDate + 604800;

    var result = [];
    Event.find({ userId: req.user._id }).then((events) => {
      if (events.length > 0) {
        for (var i = 0; i < events.length; i++) {
          if (
            (events[i].start < startDate && events[i].end > startDate) ||
            (events[i].end > endDate && events[i].start < endDate) ||
            (events[i].start >= startDate && events[i].end <= endDate)
          ) {
            result.push(events[i]);
          }
        }
      }
    });
    const u = await User.findOne({ _id: req.user._id });
    let follow = await Follow.find({ user1: req.user._id, status: 1 });

    let listFollowing = [];
    for (var i = 0; i < follow.length; i++) {
      let user = await User.findOne({ _id: follow[i].userId2 });
      user = Object.assign(
        {},
        { username: user.username, _id: user._id, email: user.email }
      );
      listFollowing.push(user);
    }
    console.log(11111111, result);
    res.render('pages/home', {
      user: u,
      listFollowing: listFollowing,
      start: startDate,
      events: result,
    });
  }
  updateEvent(req, res, next) {
    Event.findOne({ _id: req.params.eventId }).then((e) => {
      if (req.body.start != e.start || req.body.end != e.end) {
        Event.find({ userId: req.user._id }).then((events) => {
          if (events.length > 0) {
            req.body.start = new Date(req.body.start);
            req.body.end = new Date(req.body.end);
            var range = moment().range(req.body.start, req.body.end);
            for (var i = 0; i < events.length; i++) {
              if (
                (range.contains(new Date(events[i].start)) ||
                  range.contains(new Date(events[i].end))) &&
                events[i]._id !== e._id
              ) {
                res.status(409).send('conflig');
                return;
              }
            }
          }
          req.body['updatedAt'] = new Date();
          Event.updateOne({ _id: e._id }, req.body).then((ne) => {
            res.send(req.body);
          });
        });
      }
    });
  }
  deleteEvent(req, res, next) {
    Event.deleteOne({ _id: req.params.eventId }).then(() => {
      res.status(200).send('delete successfully');
    });
  }
  getEventInfo(req, res, next) {
    Event.findOne({ _id: req.params.eventId }).then((e) => {
      if (e) res.send(e);
      else res.status(404).send('not found');
    });
  }
  async importEvent(req, res, next) {
    const e = await Event.findOne({ _id: req.params.id });
    if (!e) {
      res.status(404).send('NOT FOUND');
      return;
    }
    if (e.private) {
      res.send('CANNOT IMPORT');
      return;
    }
    //  if(e['created_useId']===req.user._id)
    let data = {};
    data.start = new Date(e.start);
    data.end = new Date(e.end);

    let tmp = true;
    await Event.find({ userId: req.user._id }).then((events) => {
      if (events.length > 0) {
        var range = moment().range(data.start, data.end);

        for (var i = 0; i < events.length; i++) {
          if (
            range.contains(new Date(events[i].start)) ||
            range.contains(new Date(events[i].end))
          ) {
            tmp = false;
            res.status(409).send('conflig');
            return;
          }
        }
      }
    });

    if (tmp) {
      data['created_useId'] = e['created_useId'];
      data['userId'] = req.user._id;
      data['status'] = 1;
      data['name'] = e.name;
      data['location'] = e.location;
      data['description'] = e.description;
      data['private'] = e.private;
      data['status'] = e.status;
      const newEvent = new Event(data);
      newEvent.save().then((e1) => {
        res.send(e1);
      });
    }
  }
}
module.exports = new EventController();
