const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  totalMeeting: { type: Number },
  meetingTitle: { type: [String] },
  meetingDate: { type: Date },
  meetingTime: { type: Date } // or String
});

const Meeting = mongoose.model('Meeting', meetingSchema);
module.exports = Meeting;