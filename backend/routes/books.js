const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); // si placé avant auth, meme les req non identifiés seront enregistrées

const bookCtrl = require("../controllers/books");

router.get("/", bookCtrl.getBooks);
router.post("/", auth, multer, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.addRating)
router.get("/bestrating", bookCtrl.getRatings);
router.get("/:id", bookCtrl.getBook);
router.put("/:id", auth, multer, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;