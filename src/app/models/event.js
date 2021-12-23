const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const Event = new Schema(
  {
    _id: Number,
    name: String,
    location: String,
    description: String,
    start: String,
    end: String,
    private: Boolean,
    created_useId: Number,
    userId: Number,
    status: Number,
    //0: pending, 1:active,2 :done
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
