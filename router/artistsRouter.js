const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const { checkFileType } = require("../utils");
const Artist = require("../models/Artist");
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
      members,
      bandUrl,
    } = req.body;
    if (req.files.profile && req.files.banner) {
      const profilePicture = req.files.profile[0].path;
      const bannerPicture = req.files.banner[0].path;
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          Artist.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            genre,
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
          Artist.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            genre,
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
          Artist.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            genre,
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
          Artist.create({
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
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
  Artist.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(404).send("username not found");
    }
    bcrypt.compare(password, user.password).then((validPassword) => {
      if (!validPassword) {
        return res.status(404).send("password incorrect");
      }
      const token = generateToken({ username: user.username });
      res.json({ token });
    });
  });
});

router.put(
  "/:id",
  verifyToken,
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
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        Artist.findByIdAndUpdate(
          id,
          {
            name,
            username,
            email,
            password: hashedPassword,
            city,
            country,
            genre,
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
          });
      })
      .catch((e) => console.log(e.message));
  }
);

router.put(
  "/:id/upload-profile-pic",
  verifyToken,
  upload.single("profile_pic"),
  (req, res) => {
    const { id } = req.params;
    const { profilePicture } = req.file;
    Artist.findByIdAndUpdate(id, { profilePicture }, { new: true })
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
  }
);

router.put(
  "/:id/upload-banner-pic",
  verifyToken,
  upload.single("banner-pic"),
  (req, res) => {
    const { id } = req.params;
    const { bannerPicture } = req.body;
    Artist.findByIdAndUpdate(id, { bannerPicture }, { new: true })
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
  }
);

router.put("/:id/upcomingEvent", verifyToken, (req, res) => {
  const { id } = req.params;
  const { date, startTime, venue, address, ticketUrl, info } = req.body;
  const upcomingEvent = {
    date: date,
    startTime: startTime,
    venue: venue,
    address: address,
    ticketUrl: ticketUrl,
    info: info,
  };
  Artist.findByIdAndUpdate(
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

router.put("/:id/song", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, duration, url } = req.body;
  const song = {
    name: name,
    duration: duration,
    url: url,
  };
  Artist.findByIdAndUpdate(id, { $push: { songsList: song } }, { new: true })
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

router.put("/:id/song/:songId", verifyToken, (req, res) => {
  const { id, songId } = req.params;
  const { name, duration, url } = req.body;
  Artist.updateOne(
    { _id: id, "songsList._id": songId },
    { $set: { "songsList.$": { name, duration, url } } },
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

router.put("/:id/upcomingEvent/:eventid", verifyToken, (req, res) => {
  const { id, eventId } = req.params;
  const { date, startTime, venue, address, ticketUrl, info } = req.body;
  Artist.updateOne(
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

// DELETE Create an endpoint that DELETES an existing local artist in artist collection
router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  Artist.findByIdAndDelete(id)
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

router.delete("/:id/song/:songid", verifyToken, (req, res) => {
  const id = req.params.id;
  const songId = req.params.songid;
  Artist.updateOne(
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

router.delete("/:id/upcomingEvent/:eventid", verifyToken, (req, res) => {
  const id = req.params.id;
  const eventId = req.params.eventid;
  Artist.updateOne(
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

router.post(
  "/upload-profile-pic",
  upload.single("profile-pic"),
  (req, res, next) => {
    if (req.file) {
      res.send(
        `<h2>Here is the picture:</h2><img src='http://localhost:8000/profile-pics/${req.file.originalname}' alt='something'/>`
      );
      console.log(req.file);
    } else {
      res.status(400).send("Please upload a valid image");
    }
  }
);

module.exports = router;
