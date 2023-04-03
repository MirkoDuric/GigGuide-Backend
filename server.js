require("dotenv").config();
const client = require("./database/client");
const express = require("express");
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");
const userRouter = require("./router/userRouter.js");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Hello.  Listening on port ${PORT}`);
});
