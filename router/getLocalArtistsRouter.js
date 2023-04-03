const express = require("express");
const router = express.Router();
require("dotenv").config();
const Artist = require("../models/Artist");

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

module.exports = router;
