const express = require("express");
const router = express.Router();
const userController = require("../contoller/userController");


router.post("/login", userController.login);




module.exports = router;