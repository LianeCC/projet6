const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Fonction gestion des images avec méthode Sharp
const processImage = (file) => {
  return new Promise((resolve, reject) => {
    // Utilisation du nom de base original sans transformation
    const filenameBase = file.originalname.split('.')[0]; 
    const outputFilename = filenameBase.split('').join('_') + Date.now() + ".webp"; // Transformation seulement sur le fichier .webp
    const outputFilePath = path.join("images", outputFilename);

    sharp(file.path)
      .resize(800, 800, { 
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputFilePath)
      .then(() => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier original:", err);
          }
          resolve(outputFilename); 
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    if (req.file) {
      processImage(req.file)
        .then((filename) => {
          const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
          });
          book.save()
            .then(() => {
              res.status(201).json({ message: "Livre enregistré !" });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        })
        .catch((error) => {
          res.status(500).json({ error: "Erreur lors du traitement de l'image." });
        });
    } else {
      res.status(400).json({ error: "Aucune image fournie !" });
    }
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};


exports.getBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};


exports.updateBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book)
  } : {...req.body }; // Si une image est fournie, les données sont converties en objet, sinon req.body est utilisé

  delete bookObject._userId; // Sécurisation - suppression de l'ID venant de la req pour éviter de l'utiliser pour un autre livre
  
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Non autorisé" });
      } // Vérifie si le livre appartient à l'utilisateur

      if (req.file) {  // Si une nouvelle image est fournie
        processImage(req.file) 
          .then((filename) => {
            const newImageUrl = `${req.protocol}://${req.get("host")}/images/${filename}`;

            // Suppression de l'ancienne image si elle existe
            if (book.imageUrl) {
              const oldFilename = book.imageUrl.split("/images/")[1]; // Extraire le nom du fichier de l'ancienne image
              fs.unlink(`images/${oldFilename}`, (err) => {
                if (err) {
                  console.error("Erreur lors de la suppression de l'ancienne image :", err);
                } else {
                  console.log("Ancienne image supprimée :", oldFilename);
                }
              });
            }

            // Mise à jour du livre avec la nouvelle image
            return Book.updateOne(
              { _id: req.params.id },
              { ...bookObject, imageUrl: newImageUrl, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Livre modifié !" }))
              .catch((error) => res.status(401).json({ error }));
          })
          .catch((error) => res.status(500).json({ error: "Erreur lors du traitement de l'image." }));
      } else { // Si aucune image n'est fournie, on met à jour uniquement les données
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
  

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
    .then(book => { 
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: "Non autorisé"});
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: "Livre supprimé"})})
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {res.status(500).json({ error })});
};


exports.getBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.addRating = (req, res, next) => {
  const { userId, rating } = req.body; // ID utilisateur et note
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const existingRating = book.ratings.find((r) => r.userId === userId); // cherche dans le tableau si userId d'une note et userId de la req sont = 
      if (existingRating) {
        return res.status(409).json({ error: "Vous avez déjà noté ce livre." });
      }
      book.ratings.push({ userId, grade: rating });

      const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = totalRatings / book.ratings.length;
      
      book.save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};


exports.getRatings = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // tri decroissant 
    .limit(3)
    .then((books) => { res.status(200).json(books);
    })
    .catch((error) => { res.status(500).json({ error });
    })
};