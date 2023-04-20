const express = require("express");
const router = express.Router();
require("dotenv").config();
const User = require("../models/newUser");

//GET Create an endpoint to retrieve all local artists
router.get("/", (req, res) => {
  User.find({ userType: "Artist" })
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

//GET Create an endpoint to retrieve a specific local artist by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
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

router.get("/:name/:country/:city/:genre", (req, res) => {
  let { name, country, city, genre } = req.params;
  if (name === "0") {
    name = "";
  }
  if (city === "0") {
    city = "";
  }
  if (country === "0") {
    country = "";
  }
  if (genre === "0") {
    genre = "";
  }
  User.find({
    userType: "Artist",
    name: { $regex: name },
    city: { $regex: city },
    country: { $regex: country },
    genre: { $regex: genre },
  })
    .then((data) => {
      if (!data) {
        // Send 404 if no artist is found with the specified search parameters
        return res.sendStatus(404);
      }
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

module.exports = router;
