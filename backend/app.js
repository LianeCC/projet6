// config principale de l'app, importation routes et middlewares 
const express = require('express');
const mongoose = require("mongoose");

const booksRoutes = require("./routes/books"); 
const userRoutes = require("./routes/user");

// Connexion à MongoDB
mongoose.connect("mongodb+srv://Paupiette13:13BluePaupiette@clusterlcc.7hndt.mongodb.net/mydatabase?retryWrites=true&w=majority")
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

module.exports = app;
