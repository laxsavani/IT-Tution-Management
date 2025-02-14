const multer = require('multer');

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Not all photo formats are allowed'));
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 },
    fileFilter: fileFilter
});

module.exports = upload;

// const multer = require("multer");
// const path = require("path");
// // Multer config
// module.exports = multer({
//     storage: multer.diskStorage({}),

//     fileFilter: (req, file, cb) => {

//         console.log("file:::---", file);

//         let ext = path.extname(file.originalname);

//         if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {

//             // req.fileValidationError = "Forbidden extension";
//             req.fileValidationError = multer.MulterError 
//             return cb(null, false, req.fileValidationError);
//         }
//         cb(null, true);
//     },
// });