const express = require("express");
const router = express.Router();
const sauceCrontroller = require("../controllers/sauce.controller");
const checkToken = require("../middlewares/checkToken")
const multer = require('multer');
const { route } = require("./user.route");
const stock = multer.diskStorage({destination: "image/", filename: thefile})
const mlt = multer({storage: stock})
const Sauce = require("../models/sauce.model");

function thefile(req, file, e)
{
  e(null, "sauce" + req.body.userId + Date.now() + file.originalname)
}

function deleteItem(req, res)
{
  const theId = req.params.id
  Sauce.findByIdAndDelete(theId)
    .then((sauce) => res.send({message : "The sauce is deleted", sauce}))
    .catch((error) => console.log(error))
  console.log('Sauce Id', theId)
}

function updateItem(req, res)
{
  const theId = req.params.id
  const changeSauce = req.body
  if (req.file != null)
  {
    const imageLink = req.file
    console.log(imageLink)
  }
  Sauce.findByIdAndUpdate(theId, {name : changeSauce.name, manufacturer: changeSauce.manufacturer, description : changeSauce.description, mainPepper: changeSauce.mainPepper, heat: changeSauce.heat, userId: changeSauce.userId})
    .then((sauce) => res.send({message : "The sauce is change", sauce}))
    .catch((error) => console.log(error))
  console.log('Sauce Id', theId, req.body)
  res.send('ok')
}

router.get('/', checkToken, sauceCrontroller.getSauces)
router.post('/', checkToken, mlt.single("image") , sauceCrontroller.postSauce)
router.get('/:id', checkToken, sauceCrontroller.getSauce)
router.delete('/:id', checkToken, deleteItem)
router.put('/:id', checkToken, updateItem)

module.exports = router