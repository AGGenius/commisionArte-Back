const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10485760 // Defined in bytes (1 Mb)
    },
});


module.exports = { upload }