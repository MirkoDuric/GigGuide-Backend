const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
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
    userType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("fanUsers", newUserSchema);
module.exports = User;
