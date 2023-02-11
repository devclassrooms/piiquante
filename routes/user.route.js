const express = require("express");
const router = express.Router();
const userCrontroller = require("../controllers/user.controller");

//Créer une requête POST pour User

router.post(`/signup`, userCrontroller.signUp);
router.post(`/login`, userCrontroller.userLogin);

module.exports = router;
