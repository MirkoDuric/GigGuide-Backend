const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection was successful");
  })
  .catch((e) => console.log(e.message));

const client = mongoose.connection;

module.exports = client;
