
// config principale de l'app, importation routes et middlewares 
const express = require('express');
const mongoose = require("mongoose");
const Book = require("./models/book");

const app = express();

// Connexion à MongoDB
  mongoose.connect("mongodb+srv://Paupiette13:13BluePaupiette@clusterlcc.7hndt.mongodb.net/mydatabase?retryWrites=true&w=majority")
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware JSON
app.use(express.json());

// route POST
app.post("/api/books", (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: "Livre enregistré !"}))
    .catch(error => res.status(400).json({ error }));
});

//route modification d'un livre 
app.put("/api/books/:id", (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id:req.params.id})
  .then(() => res.status(200).json({message: "Livre modifié !"}))
  .catch(error => res.status(400).json({error}));
});

// route suppression d'un livre 
app.delete('/api/books/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});


// route get pour 1 seul livre
app.get("/api/books/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ error }));
});

// route GET à la page d'accueil
app.get("/api/books", (req, res,next) => {
  Book.find()
  .then(books =>res.status(200).json(books))
  .catch(error => res.status (400).json ({ error }))
});



module.exports = app;