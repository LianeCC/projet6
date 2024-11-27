const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); // si placé avant auth, meme les req non identifiés seront enregistrées

const bookCtrl = require("../controllers/books");

router.get("/", bookCtrl.getAllBooks);
router.post("/", auth, multer, bookCtrl.createBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;


