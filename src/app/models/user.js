const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const User = new Schema(
  {
    _id: Number,
    username: { type: String, default: '', maxLength: 255, require: true },
    password: { type: String, require: true },
    email: { type: String },
    phone: { type: Number },
    dob: { type: Date },
    following: { type: [Number], default: [] },
    follower: { type: [Number], default: [] },
  },
  {
    _id: false,
    timestamps: true,
  }
);

User.plugin(autoIncrement, {
  id: 'user',
});

module.exports = mongoose.model('User', User);
