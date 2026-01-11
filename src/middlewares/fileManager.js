const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error("INVALID_FILE_TYPE");
            return cb(error, false);
        };

        cb(null, true);
    }
});

module.exports = { upload };