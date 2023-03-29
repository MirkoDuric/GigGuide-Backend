const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const { checkFileType } = require("../utils");
const Artist = require("../models/Artist");

const storage = multer.diskStorage({
  destination: "./profile-pics",
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

router.post("/", (req, res) => {
  const { name, username, password, city, country } = req.body;
  Artist.create({ name, username, password, city, country })
    .then((data) => res.json(data))
    .catch((e) => console.log(e.message));
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, username, password, genre, bio, city, country } = req.body;
  Film.findByIdAndUpdate(
    id,
    { name, username, password, genre, bio, city, country },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        // Send 404 if no film is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.put("/:id/upload-profile-pic", (req, res) => {
  const { id } = req.params;
  const { profilePicture } = req.body;
  Film.findByIdAndUpdate(id, { profilePicture }, { new: true })
    .then((data) => {
      if (!data) {
        // Send 404 if no film is found with the specified _id
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

router.put("/:id/upload-banner-pic", (req, res) => {
  const { id } = req.params;
  const { bannerPicture } = req.body;
  Film.findByIdAndUpdate(id, { bannerPicture }, { new: true })
    .then((data) => {
      if (!data) {
        // Send 404 if no film is found with the specified _id
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
  Artist.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        // Send 404 if no film is found with the specified _id
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
  upload.single("profile_pic"),
  (req, res, next) => {
    if (req.file) {
      res.send(
        `<h2>Here is the picture:</h2><img src='http://localhost:8000/${req.file.originalname}' alt='something'/>`
      );
      console.log(req.file);
    } else {
      res.status(400).send("Please upload a valid image");
    }
  }
);

module.exports = router;
