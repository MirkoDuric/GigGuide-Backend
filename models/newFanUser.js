const mongoose = require("mongoose");

const newFanUserSchema = new mongoose.Schema({
  name: {
    type: String,
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
    type: [String],
    default: undefined,
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
    type: [String],
    default: undefined,
  },
  favouriteSongs: {
    type: [String],
    default: undefined,
  },
});

const fanUsers = mongoose.model("fanUsers", newFanUserSchema);
module.exports = fanUsers;
