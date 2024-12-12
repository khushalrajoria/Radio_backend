const multer = require('multer') ;

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg'  ||  file.mimetype === 'image/png' || file.mimetype ==='image/avif' || file.mimetype === 'image/gif' ) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only jpg ,jpeg and png image are allowed.'));
    }
};

const uploadImg = multer({ 
     storage: storage,
     limits: {fileSize: 1*1024*1024 },//1MB
     fileFilter: filefilter,
    }).single('image');


module.exports = uploadImg;
