const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const Event = new Schema(
  {
    _id: Number,
    name: String,
    location: String,
    description: String,
    start: Date,
    end: Date,
    private: Boolean,
    created_useId: Number,
    userId: Number,
    eventId: String,
    status: Number,
    //0: pending, 1:active
  },
  {
    _id: false,
    timestamps: true,
  }
);

Event.plugin(autoIncrement, {
  id: 'event',
});

module.exports = mongoose.model('Event', Event);
