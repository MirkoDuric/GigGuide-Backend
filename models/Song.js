const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
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
});

const Song = mongoose.model("Song", SongSchema);
module.exports = Song;
