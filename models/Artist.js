const mongoose = require("mongoose");
const Song = require("./Song");
const UpcomingEvent = require("./UpcomingEvent");

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  bannerPicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  songsList: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
        },
        url: {
          type: String,
        },
      },
    ],
    default: undefined,
  },
  upcomingEvents: {
    type: [
      {
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
      },
    ],
    default: undefined,
  },
});

const Artist = mongoose.model("Artist", ArtistSchema);
module.exports = Artist;
