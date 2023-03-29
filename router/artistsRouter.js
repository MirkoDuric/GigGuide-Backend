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

//GET Create an endpoint to retrieve all local artists
router.get("/", (req, res) => {
  Artist.find({}).then((data) => res.json(data));
});

//GET Create an endpoint to retrieve a specific local artist by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Artist.findById(id)
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
      res.send("Single File Uploaded Successfully");
      console.log(req.file);
    } else {
      res.status(400).send("Please upload a valid image");
    }
  }
);

module.exports = router;
