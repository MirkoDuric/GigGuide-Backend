const mongoose = require("mongoose");

const UpcomingEventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ticketUrl: {
    type: String,
  },
  info: {
    type: String,
  },
});

const UpcomingEvent = mongoose.model("UpcomingEvent", UpcomingEventSchema);
module.exports = UpcomingEvent;
