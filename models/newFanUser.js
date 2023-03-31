const mongoose = require("mongoose");

const newFanUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favouriteGenre: {
    type: Array,
  },
  profilePicture: {
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
  favouriteArtists: {
    type: Array,
    default: undefined,
  },
  favouriteSongs: {
    type: Array,
    default: undefined,
  },
  planedEvents: {
    type: Array,
    default: undefined,
  },
});

const fanUsers = mongoose.model("fanUsers", newFanUserSchema);
module.exports = fanUsers;
