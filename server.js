require("dotenv").config();
const client = require("./database/client");
const express = require("express");
const app = express();
const PORT = 8000;
const bodyParser = require("body-parser");
const fansRouter = require("./router/fanRouter.js");

app.use(bodyParser.json());
app.use("/api/user/fans", fansRouter);

app.listen(PORT, () => {
  console.log(`Hello.  Listening on port ${PORT}`);
});
