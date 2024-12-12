const multer = require('multer') ;

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})

const filefilter = async(req, file, cb) => {
    if (!file.originalname.match(/\.(pdf|doc|docx|txt|png|jpeg|jpg)$/)) {
      return cb(
          new Error(
            'only upload files with  pdf, doc, docx, txt,png,jpeg,jpg files format are allowed.'
          )
        );
      }
      cb(undefined, true);
};

const uploadReport =  multer({ 
     storage: storage,
     limits: {fileSize: 5*1024*1024 },//5MB
     fileFilter: filefilter,
    }).single('report');


module.exports = uploadReport;
