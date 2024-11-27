const express = require("express");
const router = express.Router();

const bookCtrl = require("../controllers/books");

router.post("/", bookCtrl.createBook);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", bookCtrl.modifyBook);
router.delete("/:id", bookCtrl.deleteBook);
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
