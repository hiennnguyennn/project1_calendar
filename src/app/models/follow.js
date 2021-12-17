const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const Follow = new Schema(
  {
    _id: Number,
    userId1: { type: Number, require: true }, //nguoi follow
    userId2: { type: Number, require: true }, //nguoi duoc follow
    status: { type: Number },
  },
  {
    _id: false,
    timestamps: true,
  }
);

Follow.plugin(autoIncrement, {
  id: 'follow',
});

module.exports = mongoose.model('Follow', Follow);
