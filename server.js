require("dotenv").config();
const client = require("./database/client");
const express = require("express");
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");
const artists = require("./router/artistsRouter.js");

app.use(bodyParser.json());
app.use("api/user/artist", artists);

app.listen(PORT, () => {
  console.log(`Hello.  Listening on port ${PORT}`);
});
