const express = require("express");
const router = express.Router();
const sauceCrontroller = require("../controllers/sauce.controller");
const checkToken = require("../middlewares/checkToken")
const multer = require('multer')
const stock = multer.diskStorage({destination: "image/", filename: thefile})
const mlt = multer({storage: stock})

function thefile(req, file, e)
{
  e(null, "sauce" + req.body.userId + Date.now() + file.originalname)
}

router.get('/', checkToken, sauceCrontroller.getSauces)
router.post('/', checkToken, mlt.single("image") , sauceCrontroller.postSauce)
router.get('/:id', checkToken, sauceCrontroller.getSauce)

module.exports = router