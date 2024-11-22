// config principale de l'app, importation routes et middlewares 

const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");

const app = express();

// Connexion à MongoDB
mongoose.connect(
  "mongodb+srv://lianecoupat:eJjguhRAGmyU9Gi5@clusterlcc.7hndt.mongodb.net/mydatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(err => console.error("Connexion à MongoDB échouée :", err));



// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// route GET à la page d'accueil
app.get("/", (req, res) => {
  console.log("test nodemon");
  res.send("Bienvenue sur Mon Vieux Grimoire --- site web pour analyser/voter vos livres préférés ! ");
});

// Middleware JSON
app.use(express.json());

// route POST
app.post("/data", (req, res) => {
  const receivedData = req.body; // Les données envoyées dans le corps de la requête
  console.log('Données reçues:', receivedData);
  res.status(201).json({ message: 'Données reçues avec succès', data: receivedData });
});



module.exports = app;