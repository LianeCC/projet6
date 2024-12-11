const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Fonction gestion des images avec méthode Sharp
const processImage = (file) => {
  return new Promise((resolve, reject) => {
    const outputFilename = `${file.filename.split('.')[0]}.webp`;
    const outputFilePath = path.join("images", outputFilename);

    console.log("Fichier reçu pour traitement:", file.path);

    sharp(file.path)
      .resize(800, 800, { // taille max
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // ajuste qualité du webp
      .toFile(outputFilePath) // chemin complet
      .then(() => {
        console.log("Image convertie et enregistrée:", outputFilePath);

        // Supprime l'image originale après conversion
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression de l'image originale:", err);
            reject(err);
          } else {
            console.log("Image originale supprimée:", file.path);
            resolve(outputFilename);
          }
        });
      })
      .catch((error) => {
        console.error("Erreur lors du traitement Sharp:", error);
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
              console.log("Livre enregistré avec succès !");
              res.status(201).json({ message: "Livre enregistré !" });
            })
            .catch((error) => {
              console.error("Erreur lors de l'enregistrement du livre:", error);
              res.status(400).json({ error });
            });
        })
        .catch((error) => {
          console.error("Erreur lors du traitement de l'image:", error);
          res.status(500).json({ error: "Erreur lors du traitement de l'image" });
        });
    } else {
      console.error("Aucune image fournie !");
      res.status(400).json({ error: "Aucune image fournie !" });
    }
  } catch (error) {
    console.error("Erreur générale dans createBook:", error);
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
    ...JSON.parse(req.body.book)} 
    : {...req.body }; // si image founie, données converties en objet et ajoutées à bookObject - si 0 image, req.body directement utilisé comme bookObject

  delete bookObject._userId; //sécurité - suppression de l'id venant de la req pour éviter de le réutiliser pr un autre livre
  
  Book.findOne({_id: req.params.id})
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message : "Non autorisé" });
      } //verifie si livre appartient à l'user
        
        if (req.file) {  //cas si nouvelle image fournie
          processImage(req.file)
            .then((filename) => { // et on supprime l'ancienne image si elle existe
              if (book.imageUrl) {
                const oldFilename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${oldFilename}`, () => {});
              }
  
              Book.updateOne( // données remplacées par celles de bookObject
                { _id: req.params.id },
                {
                  ...bookObject,
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`,
                  _id: req.params.id,
                }
              )
                .then(() => res.status(200).json({ message: "Livre modifié !" }))
                .catch((error) => res.status(401).json({ error }));
            })
            .catch((error) =>
              res.status(500).json({ error: "Erreur lors du traitement de l'image" })
            );

        // cas si aucune image fournie, uniquement les données 
        } else {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Livre modifié !" }))
            .catch((error) => res.status(401).json({ error })); // non autorisé
        }
      })
      .catch((error) => res.status(400).json({ error })); // erreur requete lors de la recherche du livre
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
  .then((books) => {
    res.status(200).json(books);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
}