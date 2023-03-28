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
    type: [Song],
    default: undefined,
  },
  upcomingEvents: {
    type: [UpcomingEvent],
    default: undefined,
  },
});

const Artist = mongoose.model("Artist", ArtistSchema);
module.exports = Artist;
