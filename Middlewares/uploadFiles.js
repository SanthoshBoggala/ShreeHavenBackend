const multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({storage})

module.exports = upload;