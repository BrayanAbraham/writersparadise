const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    console.log(file);
    if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
      cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error("Wrong file type"));
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

module.exports = upload;
