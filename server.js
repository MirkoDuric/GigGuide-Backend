require("dotenv").config();
require("./database/client");
const client = require("./database/client");
const express = require("express");
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");
const artistsUser = require("./router/artistsRouter.js");
const artists = require("./router/getLocalArtistsRouter.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./profile-pics"));
app.use("/api/user/artist", artistsUser);
app.use("/api/artists", artists);

app.listen(PORT, () => {
  console.log(`Hello.  Listening on port ${PORT}`);
});
