const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const url = require("url");
require("dotenv").config();

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(":");

const config = {
  user: auth[0],
  host: params.hostname,
  database: process.env.DATABASE_NAME,
  password: auth[1],
  port: 5432,
};

const pool = new Pool(config);

router.route("/api/recipes").get((req, res, next) => {
  pool
    .query("SELECT * FROM recipes;")
    .then(({ rows }) => res.json(rows))
    .catch((e) => res.sendStatus(500));
});
router.route("/api/recipes/:recipe_id").get((req, res, next) => {
  const id = req.params.recipe_id;
  pool
    .query("SELECT * FROM recipes WHERE recipe_id=$1;", [id])
    .then(({ rows }) => res.json(rows))
    .catch((e) => res.sendStatus(404));
});

module.exports = router;
