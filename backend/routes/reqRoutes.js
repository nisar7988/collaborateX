const express = require("express");
const {sendUsers} =require("../controllers/req.controller.js")

const router = express.Router();

router.get("/get-users", sendUsers);

module.exports = router;