const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const { checkFileType } = require("../utils");
const User = require("../models/newUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/auth");
const secret = process.env.MY_SECRET;

const generateToken = (data) => {
  return jwt.sign(data, secret, { expiresIn: "1800s" }); //token expires in 30 minutes
};

//setting multer for profile pics
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile") {
      cb(null, "./profile-pics");
    }
    if (file.fieldname === "banner") {
      cb(null, "./banner-pics");
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

router.post(
  "/signup",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      name,
      username,
      email,
      password,
      city,
      country,
      genre,
      age,
      favouriteGenre,
      favouriteArtists,
      favouriteSongs,
      planedEvents,
      userType,
      members,
      bandUrl,
    } = req.body;
    if (req.files.profile && req.files.banner) {
      const profilePicture = req.files.profile[0].path;
      const bannerPicture = req.files.banner[0].path;
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          User.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            genre,
            age,
            favouriteGenre,
            favouriteArtists,
            favouriteSongs,
            planedEvents,
            userType,
            members,
            bandUrl,
            profilePicture,
            bannerPicture,
          })
            .then((data) => res.json(data))
            .catch((e) => console.log(e.message));
        })
        .catch((e) => console.log(e.message));
    } else if (req.files.profile) {
      const profilePicture = req.files.profile[0].path;
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          User.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            genre,
            age,
            favouriteGenre,
            favouriteArtists,
            favouriteSongs,
            planedEvents,
            userType,
            members,
            bandUrl,
            profilePicture,
          })
            .then((data) => res.json(data))
            .catch((e) => console.log(e.message));
        })
        .catch((e) => console.log(e.message));
    } else if (req.files.banner) {
      const bannerPicture = req.files.banner[0].path;
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          User.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            genre,
            age,
            favouriteGenre,
            favouriteArtists,
            favouriteSongs,
            planedEvents,
            userType,
            members,
            bandUrl,
            bannerPicture,
          })
            .then((data) => res.json(data))
            .catch((e) => console.log(e.message));
        })
        .catch((e) => console.log(e.message));
    } else {
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          User.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            age,
            favouriteGenre,
            favouriteArtists,
            favouriteSongs,
            planedEvents,
            userType,
            genre,
            members,
            bandUrl,
          })
            .then((data) => res.json(data))
            .catch((e) => console.log(e.message));
        })
        .catch((e) => console.log(e.message));
    }
  }
);

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(404).send("username not found");
    }
    bcrypt.compare(password, user.password).then((validPassword) => {
      if (!validPassword) {
        return res.status(404).send("password incorrect");
      }
      const token = generateToken({ username: user.username });
      const response = user;
      res.json({ token, response });
    });
  });
});

router.put(
  "/:id",

  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  (req, res) => {
    const { id } = req.params;
    const {
      name,
      username,
      password,
      genre,
      bio,
      city,
      country,
      age,
      favouriteGenre,
      favouriteArtists,
      favouriteSongs,
      planedEvents,
      members,
      bandUrl,
      email,
    } = req.body;
    const getProfilePicture = () => {
      if (req.files.profile) {
        return req.files.profile[0].path;
      }
    };
    const profilePicture = getProfilePicture();
    const getBannerPicture = () => {
      if (req.files.banner) {
        return req.files.banner[0].path;
      }
    };
    const bannerPicture = getBannerPicture();
    bcrypt.hash(password, 10).then((hashedPassword) => {
      User.findByIdAndUpdate(
        id,
        {
          name,
          username,
          email,
          password: hashedPassword,
          age,
          favouriteGenre,
          favouriteArtists,
          favouriteSongs,
          planedEvents,
          city,
          country,
          genre,
          bio,
          members,
          bandUrl,
          profilePicture,
          bannerPicture,
        },
        { new: true }
      )
        .then((data) => {
          if (!data) {
            // Send 404 if no artist is found with the specified _id
            return res.sendStatus(404);
          }
          res.json(data);
        })
        .catch((err) => {
          console.log(err.message);
          res.sendStatus(500);
        })
        .catch((e) => console.log(e.message));
    });
  }
);

router.put("/:id/upcomingEvent", (req, res) => {
  const { id } = req.params;
  const {
    eventName,
    artistName,
    date,
    startTime,
    venue,
    address,
    ticketUrl,
    info,
  } = req.body;
  const upcomingEvent = {
    eventName,
    artistName,
    date: date,
    startTime: date,
    venue: venue,
    address: address,
    ticketUrl: ticketUrl,
    info: info,
  };
  User.findByIdAndUpdate(
    id,
    { $push: { upcomingEvents: upcomingEvent } },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.put("/:id/song", (req, res) => {
  const { id } = req.params;
  const { name, duration, url, releaseDate, album } = req.body;
  const song = {
    name: name,
    duration: duration,
    url: url,
    releaseDate: releaseDate,
    album: album,
  };
  User.findByIdAndUpdate(id, { $push: { songsList: song } }, { new: true })
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log("Didn't receive request for song with id", id);
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.put("/:id/song/:songId", (req, res) => {
  const { id, songId } = req.params;
  const { name, duration, url, releaseDate, album } = req.body;
  User.updateOne(
    { _id: id, "songsList._id": songId },
    { $set: { "songsList.$": { name, duration, url, releaseDate, album } } },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.put("/:id/upcomingEvent/:eventId", (req, res) => {
  const { id, eventId } = req.params;
  const { date, startTime, venue, address, ticketUrl, info } = req.body;
  User.updateOne(
    { _id: id, "upcomingEvents._id": eventId },
    {
      $set: {
        "upcomingEvents.$": {
          date,
          startTime,
          venue,
          address,
          ticketUrl,
          info,
        },
      },
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});
//CREATING OR UPDATING BIOGRAPHY
router.put("/:id/biography", (req, res) => {
  const { id } = req.params;
  const { bio } = req.body;
  console.log(req.body);
  User.updateOne(
    { _id: id },
    {
      $set: {
        bio: bio,
      },
    },
    { upsert: true, new: true }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.put("/:id/faveArtist", (req, res) => {
  const { id } = req.params;
  const { favouriteArtists } = req.body;

  User.findByIdAndUpdate(
    id,
    {
      favouriteArtists,
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.put("/:id/plannedEvents", (req, res) => {
  const { id } = req.params;
  const { plannedEvents } = req.body;

  User.findByIdAndUpdate(
    id,
    {
      plannedEvents,
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

// DELETE Create an endpoint that DELETES an existing local artist in artist collection
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.delete("/:id/song/:songid", (req, res) => {
  const id = req.params.id;
  const songId = req.params.songid;
  User.updateOne(
    { _id: id },
    { $pull: { songsList: { _id: songId } } },
    { safe: true, multi: false }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.delete("/:id/upcomingEvent/:eventid", (req, res) => {
  const id = req.params.id;
  const eventId = req.params.eventid;
  User.updateOne(
    { _id: id },
    { $pull: { upcomingEvents: { _id: eventId } } },
    { safe: true, multi: false }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified _id
        return res.sendStatus(404);
      }
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found!");
      } else {
        return res.json(user);
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.sendStatus(500);
    });
});
router.get("/:username", (req, res) => {
  const username = req.params.username;
  User.findById(username)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found!");
      } else {
        return res.json(user);
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.sendStatus(500);
    });
});

module.exports = router;
