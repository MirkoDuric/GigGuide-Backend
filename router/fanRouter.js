require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fanUsers = require("../models/newFanUser");

// const multer = require("multer");
// const upload = multer();

// POST method for saving new fan user to the database, username unique
router.post("/adduser", (req, res) => {
  const {
    name,
    username,
    password,
    favouriteGenre,
    profilePicture,
    city,
    country,
    favouriteArtists,
    favouriteSongs,
  } = req.body;
  fanUsers
    .create({
      name,
      username,
      password,
      favouriteGenre,
      profilePicture,
      city,
      country,
      favouriteArtists,
      favouriteSongs,
    })
    .then((data) => res.json(data))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(400).json({ message: "Username already exists" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    });
});

// GET method, not that relevant for fan users at this point, they won't be in search list
router.get("/getusers", async (req, res) => {
  try {
    const users = await fanUsers.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//PUT method to update different properties
router.put("/updateuser/:username/:tobeupdated/:newvalue", (req, res) => {
  const username = req.params.username;
  const tobeupdated = req.params.tobeupdated;
  const newvalue = req.params.newvalue;
  let updateObject = {};
  if (
    tobeupdated === "favouriteGenre" ||
    tobeupdated === "favouriteArtists" ||
    tobeupdated === "favouriteSongs"
  ) {
    updateObject[tobeupdated] = newvalue.split(",");
  } else {
    updateObject[tobeupdated] = newvalue;
  }
  fanUsers
    .findOneAndUpdate({ username: `${username}` }, updateObject, { new: true })
    .then((result) => {
      console.log("Record updated successfully");
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

//DELETE method to delete specific user by username, username unique
router.delete("/deleteuser/:username", (req, res) => {
  const username = req.params.username;
  fanUsers
    .deleteOne({ username: `${username}` })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.send(
          "Username not found. Please check the username and type the existing one"
        );
      } else {
        console.log("Record deleted successfully");
        res.send("Record deleted successfully");
        res.json(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
