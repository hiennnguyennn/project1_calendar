let Event = require('../models/event');
let User = require('../models/user');
const Follow = require('../models/follow');
const Moment = require('moment');
const MomentRange = require('moment-range');
const { VirtualType } = require('mongoose');
const { BulkWriteResult } = require('mongodb');
const exportEventToExcel = require('../middleware/exportService');

const moment = MomentRange.extendMoment(Moment);
class EventController {
  async createEvent(req, res, next) {
    let backURL = req.header('Referer') || '/';
    backURL = backURL.slice(21);
    let t = new Date(req.body.start);
    t.setHours(t.getHours() + 7);
    req.body.start = parseInt((t.getTime() / 1000).toFixed(0));
    t = new Date(req.body.end);
    t.setHours(t.getHours() + 7);
    req.body.end = parseInt((t.getTime() / 1000).toFixed(0));
    req.body.private = req.body.private ? 1 : 0;
    await Event.find({ userId: req.user._id }).then((events) => {
      if (events.length > 0) {
        // var range = moment().range(req.body.start, req.body.end);
        for (var i = 0; i < events.length; i++) {
          if (
            (req.body.start >= events[i].start &&
              req.body.start <= events[i].end) ||
            (req.body.end <= events[i].end && req.body.end >= events[i].start)
          ) {
            res.redirect(`${backURL}?mess=1`);
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
        res.redirect(`${backURL}?mess=8`);
      });
    });
  }
  async getEvent(req, res, next) {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1;
    let firstDate = new Date(curr.setDate(first));
    firstDate = firstDate.getTime();
    let startOfDay = new Date(firstDate - (firstDate % 86400000));
    let startDate;

    if (startOfDay.getDay() !== 0)
      startDate =
        req.params.date_start || startOfDay.getTime() / 1000 - 24 * 60 * 60;
    else startDate = req.params.date_start || startOfDay.getTime() / 1000;
    startDate = Number(startDate);

    const endDate = startDate + 604800;

    var result = [];
    await Event.find({ userId: req.user._id }).then((events) => {
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
    if (result.length === 0) result = 0;

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

    res.render('pages/home', {
      user: u,
      listFollowing: listFollowing,
      start: startDate,
      events: result,
    });
  }
  async updateEvent(req, res, next) {
    let backURL = req.header('Referer') || '/';
    backURL = backURL.slice(21);
    req.body.private = req.body.private ? 1 : 0;
    let t = new Date(req.body.start);
    t.setHours(t.getHours() + 7);
    req.body.start = parseInt((t.getTime() / 1000).toFixed(0));
    t = new Date(req.body.end);
    t.setHours(t.getHours() + 7);
    req.body.end = parseInt((t.getTime() / 1000).toFixed(0));
    console.log(req.body, 111);
    await Event.findOne({ _id: req.params.eventId }).then(async (e) => {
      if (req.body.start != e.start || req.body.end != e.end) {
        console.log(333);
        await Event.find({ userId: req.user._id }).then((events) => {
          if (events.length > 0) {
            // var range = moment().range(req.body.start, req.body.end);
            for (var i = 0; i < events.length; i++) {
              if (
                (req.body.start >= events[i].start &&
                  req.body.start <= events[i].end) ||
                (req.body.end <= events[i].end &&
                  req.body.end >= events[i].start)
              ) {
                res.redirect(`${backURL}?mess=5`);
                return;
              }
            }
          }
        });
      }
      console.log(222, req.body);
      req.body['updatedAt'] = new Date();
      await Event.updateOne({ _id: e._id }, req.body);
      res.redirect(`${backURL}?mess=7`);
    });
  }
  deleteEvent(req, res, next) {
    let backURL = req.header('Referer') || '/';
    backURL = backURL.slice(21);
    Event.deleteOne({ _id: req.params.eventId }).then(() => {
      res.redirect(`${backURL}?mess=6`);
    });
  }

  async importEvent(req, res, next) {
    const e = await Event.findOne({ _id: req.params.id });

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
  async exportToExcel(req, res, next) {
    let backURL = req.header('Referer') || '/';
    backURL = backURL.slice(21);
    let e = await Event.find({ userId: req.user._id });
    for (var i = 0; i < e.length; i++) {
      e[i].start = new Date(Number(e[i].start) * 1000).toISOString();

      e[i].end = new Date(Number(e[i].end) * 1000).toISOString();
      e[i].private = e[i].private == 1 ? 'Private' : 'Public';
    }
    console.log(e);
    const workSheetColumnName = [
      '_id',
      'name',
      'location',

      'description',
      'start',

      'end',
      'private',
      'created_useId',

      'userId',

      'status',
      'createdAt',
      'updatedAt',
    ];
    const workSheetName = 'Events';
    const filePath = './outputFiles/excel-from-js.xlsx';

    exportEventToExcel(e, workSheetColumnName, workSheetName, filePath);
    res.redirect(`${backURL}?mess=0`);
  }
}
module.exports = new EventController();
