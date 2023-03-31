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
    age,
    username,
    password,
    favouriteGenre,
    profilePicture,
    city,
    country,
    favouriteArtists,
    favouriteSongs,
    planedEvents,
  } = req.body;
  fanUsers
    .create({
      name,
      age,
      username,
      password,
      favouriteGenre,
      profilePicture,
      city,
      country,
      favouriteArtists,
      favouriteSongs,
      planedEvents,
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

//PUT method to update different properties but no arrays
router.put("/updateuser/:username/:tobeupdated/:newvalue", (req, res) => {
  const { username, tobeupdated, newvalue } = req.params;
  fanUsers
    .findOneAndUpdate(
      { username: `${username}` },
      { $set: { [tobeupdated]: newvalue } },
      {
        new: true,
      }
    )
    .then((result) => {
      console.log("Record updated successfully");
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Removing or adding one or more elements from an array favouriteGenre, favouriteArtists or favouriteSongs
router.put("/:addorremove/:username/:tobeupdated/:value", (req, res) => {
  const { addorremove, username, tobeupdated, value } = req.params;
  let updateObject = {};
  updateObject[tobeupdated] = value.split(",");
  if (addorremove === "addtothearray") {
    fanUsers
      .findOneAndUpdate(
        { username: username },
        { $addToSet: { [tobeupdated]: { $each: updateObject[tobeupdated] } } },
        {
          new: true,
        }
      )
      .then((result) => {
        console.log("Record updated successfully");
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (addorremove === "removefromarray") {
    fanUsers
      .findOneAndUpdate(
        { username: username },
        { $pull: { [tobeupdated]: { $in: updateObject[tobeupdated] } } },
        { new: true }
      )
      .then((result) => {
        console.log(`${tobeupdated} updated successfully`);
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
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
        console.log("User deleted successfully");
        res.send("User deleted successfully");
        res.json(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
