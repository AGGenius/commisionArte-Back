const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'C:/Users/Adrian/Desktop/PersonalProjects/CommisionArte-Back/uploads');
    },
    filename: function (req, file, callback) {
        // You can write your own logic to define the filename here (before passing it into the callback), e.g:
        //console.log(file.originalname); // User-defined filename is available
        const filename = `image_${crypto.randomUUID()}.png`; // Create custom filename (crypto.randomUUID available in Node 19.0.0+ only)
        req.res.locals.fileName = filename;
        callback(null, filename);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10485760 // Defined in bytes (1 Mb)
    },
});


module.exports = { upload }