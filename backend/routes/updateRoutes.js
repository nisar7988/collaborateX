const express = require("express");
const {handleProfileUpdate,removeProfilePic} =require("../controllers/update.conroller")

const router = express.Router();

router.put("/profile", handleProfileUpdate);
router.put("/remove-pic", removeProfilePic);
module.exports = router;

