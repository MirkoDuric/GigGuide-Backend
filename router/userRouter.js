require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/newUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/auth");

// const multer = require("multer");
// const upload = multer();

const secret = process.env.MY_SECRET;

const generateToken = (data) => {
  return jwt.sign(data, secret, { expiresIn: "1800s" });
};

// POST method for saving new fan user to the database, username unique
router.post("/signup", (req, res) => {
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
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        age,
        username,
        password: hashedPassword,
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
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    bcrypt.compare(password, user.password).then((validPassword) => {
      if (!validPassword) {
        return res.status(404).send("Invalid credentials");
      }
      const token = generateToken({ username: user.username });
      res.json({ token });
    });
    res.status(204).send();
  });
});

// GET method, not that relevant for fan users at this point, they won't be in search list
router.get("/getusers", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//PUT method to update user info
router.put("/updateuserdata/:username", verifyToken, (req, res) => {
  const namefilter = req.params.username;
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
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.findOneAndUpdate(
        { username: namefilter },
        {
          name,
          age,
          username,
          password: hashedPassword,
          favouriteGenre,
          profilePicture,
          city,
          country,
          favouriteArtists,
          favouriteSongs,
          planedEvents,
        },
        { new: true }
      )
        .then((data) => res.json(data))
        .catch((err) => {
          if (err.code === 11000) {
            res.status(400).json({ message: "Username already exists" });
          } else {
            res.status(500).json({ message: "Internal server error" });
            console.log(err);
          }
        });
    })
    .catch(() => {
      res.sendStatus(500);
    });
  User.findOneAndUpdate(
    { username: namefilter },
    {
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
    },
    { new: true }
  )
    .then((result) => {
      console.log("Record updated successfully");
    })
    .catch((err) => {
      console.error(err.message);
    });
});

//DELETE method to delete specific user by username, username unique
router.delete("/deleteuser/:username", verifyToken, (req, res) => {
  const username = req.params.username;
  User.deleteOne({ username: `${username}` })
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
