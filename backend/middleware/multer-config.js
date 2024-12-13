const multer = require('multer');

const MIME_TYPES = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        // Garde le nom original 
        const originalName = file.originalname.split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, originalName + Date.now() + "." + extension); // horodatage
    }
});

module.exports = multer({ storage }).single("image");