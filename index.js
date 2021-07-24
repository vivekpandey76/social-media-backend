const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

PORT = process.env.PORT || 5000;

mongoose.connect(
  process.env.CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database is connected Succesfully");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Welcome to home page!");
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:5000");
});
