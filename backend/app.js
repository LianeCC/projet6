// config principale de l'app, importation routes et middlewares 

const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/book");

const app = express();

// Connexion à MongoDB
mongoose.connect(
  "mongodb+srv://lianecoupat:eJjguhRAGmyU9Gi5@clusterlcc.7hndt.mongodb.net/mydatabase?retryWrites=true&w=majority",
  { }
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
  Book.find()
  .then(books =>res.status(200).json(books))
  .catch(error => res.status (400).json ({ error }))
});

// Middleware JSON
app.use(express.json());

// route POST
app.post("/data", (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: "Livre enregistré !"}))
    .catch(error => res.status(400).json({ error }));
});



module.exports = app;