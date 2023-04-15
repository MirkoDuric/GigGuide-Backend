const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    bannerPicture: {
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
    },
    favouriteSongs: {
      type: Array,
    },
    plannedEvents: {
      type: Array,
    },
    userType: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    genre: {
      type: String,
      default: "",
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
          releaseDate: {
            type: Date,
          },
          album: {
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
    members: {
      type: [String],
      default: undefined,
    },
    bandUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", newUserSchema);
module.exports = User;
