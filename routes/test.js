const express = require("express");
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

const router = express.Router();

router.post("/upload", (req, res) => {
  upload(req, res, err => {
    console.log("Request ---", req.body);
    console.log("Request file ---", req.file); //Here you get file.
    /*Now do where ever you want to do*/
    if (!err) {
      return res.status(200);
    } else {
      console.log(err);
      return res.status(400).json({ wrongfiletype: "Only images Allowed" });
    }
  });
});

module.exports = router;
