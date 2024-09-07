const express = require("express");
const {sendUsers,sendProfilePicture} =require("../controllers/req.controller.js")

const router = express.Router();

router.get("/get-users", sendUsers);
router.get("/profile-picture",sendProfilePicture)
module.exports = router;