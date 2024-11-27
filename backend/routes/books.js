const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// route POST
router.post("/", (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch(error => res.status(400).json({ error }));
});

// route GET pour 1 seul livre
router.get("/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

// route modification d'un livre
router.put("/:id", (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch(error => res.status(400).json({ error }));
});

// route suppression d'un livre
router.delete("/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch(error => res.status(400).json({ error }));
});

// route GET pour récupérer tous les livres
router.get("/", (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

module.exports = router;
