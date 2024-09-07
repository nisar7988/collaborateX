const express = require("express");
const multer = require("multer");
const path = require("path")
const { handleUpload,removeProfilePic } = require("../controllers/post.controller.js");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./backend/uploads");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), handleUpload);
router.post("/remove-pic",removeProfilePic)

module.exports = router;
