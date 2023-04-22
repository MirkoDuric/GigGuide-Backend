require("dotenv").config();
require("./database/client");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;
const bodyParser = require("body-parser");
const userRouter = require("./router/userRouter.js");
const cors = require("cors");

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/user", userRouter);

const artists = require("./router/getLocalArtistsRouter.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/profile-pics", express.static("./profile-pics"));
app.use("/banner-pics", express.static("./banner-pics"));

app.use("/api/artists", artists);

app.listen(PORT, () => {
  console.log(`Hello.  Listening on port ${PORT}`);
});
