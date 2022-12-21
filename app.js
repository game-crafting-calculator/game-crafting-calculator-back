require("dotenv").config();

const express = require("express");
// const mongoose = require ('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user.route");
const itemRoutes = require("./routes/item.route");
// const auth = require("./middleware/auth");
const recipeRoutes = require("./routes/recipe.route");
const bookmarksRoutes = require("./routes/bookmarks.route");

const path = require("path");

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.warn("----------------------");
  console.warn(req.url);
  console.warn(req.method);
  console.warn(req.body);
  console.warn(req.ip);
  console.warn(req.headers);
  console.warn("----------------------");
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/bookmarks", bookmarksRoutes);

module.exports = app;
