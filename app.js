require("dotenv").config();

const express = require("express");
// const mongoose = require ('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user.route");
const itemRoutes = require("./routes/item.route");
// const auth = require("./middleware/auth");
const recipeRoutes = require("./routes/recipe.route");

const path = require("path");

// mongoose.connect('mongodb+srv://admin:Kq3QBbiLDkdiUZnH@digichat.otbhvo9.mongodb.net/game-crafting-calculator',
// { useNewUrlParser: true,
//   useUnifiedTopology: true })
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch(() => console.log('Connexion à MongoDB échouée !'));

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

module.exports = app;
