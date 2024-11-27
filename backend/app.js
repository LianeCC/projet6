// config principale de l'app, importation routes et middlewares 
require('dotenv').config(); 
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const booksRoutes = require("./routes/books"); 
const userRoutes = require("./routes/user");

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();    

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware JSON
app.use(express.json());

// Définir les routes
app.use("/api/books", booksRoutes); 
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
