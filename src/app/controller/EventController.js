let Event = require('../models/event');
let User = require('../models/user');
const Moment = require('moment');
const MomentRange = require('moment-range');
const { VirtualType } = require('mongoose');

const moment = MomentRange.extendMoment(Moment);
class EventController {
  createEvent(req, res, next) {
    req.body.start = new Date(req.body.start);
    req.body.end = new Date(req.body.end);
    Event.find({ userId: req.user._id }).then((events) => {
      if (events.length > 0) {
        var range = moment().range(req.body.start, req.body.end);
        for (var i = 0; i < events.length; i++) {
          if (
            range.contains(new Date(events[i].start)) ||
            range.contains(new Date(events[i].end))
          ) {
            res.status(409).send('conflig');
            return;
          }
        }
      }
      req.body['created_useId'] = req.user._id;
      req.body['userId'] = req.user._id;
      req.body['eventId'] = req.user._id + '' + req.body.start.getTime();
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
  getEvent(req, res, next) {
    const startDate = new Date(
      req.params.date_start.slice(0, 4) +
        '-' +
        req.params.date_start.slice(4, 6) +
        '-' +
        req.params.date_start.slice(6)
    );
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);
    const range = moment().range(startDate, endDate);
    var result = [];
    Event.find({ userId: req.user._id }).then((events) => {
      if (events.length > 0) {
        for (var i = 0; i < events.length; i++) {
          if (
            range.contains(new Date(events[i].start)) ||
            range.contains(new Date(events[i].end))
          ) {
            result.push(events[i]);
          }
        }
      }
      res.send(result);
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
    console.log(req.params.eventId);
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
    console.log(data.start);
    let tmp = true;
    await Event.find({ userId: req.user._id }).then((events) => {
      console.log(events);
      if (events.length > 0) {
        var range = moment().range(data.start, data.end);
        console.log(req.user._id, range);
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
    console.log(tmp);
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
