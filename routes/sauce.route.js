const express = require("express");
const router = express.Router();
const sauceCrontroller = require("../controllers/sauce.controller");
const checkToken = require("../middlewares/checkToken")
const multer = require('multer');
const { route } = require("./user.route");
const stock = multer.diskStorage({destination: "image/", filename: thefile})
const mlt = multer({storage: stock})
const Sauce = require("../models/sauce.model");
const { findById } = require("../models/sauce.model");
const fs = require("fs")
function thefile(req, file, e)
{
  e(null, "sauce" + Date.now() + file.originalname)
}

function deleteItem(req, res)
{
  
  const theId = req.params.id
  Sauce.findByIdAndDelete(theId)
    .then((sauce) => {
      console.log(sauce)
      const filename = sauce.imageUrl.split('/image/')[1];
      fs.unlink(`image/${filename}`, () => {
        // si la suppression réussit, executer cette ligne
        res.send({message : "The sauce is deleted", sauce})
      })
    })
    .catch((error) => console.log(error))
  console.log('Sauce Id', theId)
}

function updateItem(req, res)
{
  const theId = req.params.id
  const changeSauce = req.body.sauce
  const changeTheSauce = req.body
  if (req.file != null)
  {
    const sauceObj = JSON.parse(req.body.sauce)
    console.log("*****", sauceObj, "*****")
    const e = "http://localhost:3000/image/" + req.file.filename
    const autre = {imageUrl : e }
    Sauce.findByIdAndUpdate(theId, autre)
      .then((sauce) => {
        console.log ({message : "The sauce is change", sauce})
        return(Sauce.findByIdAndUpdate(theId, sauceObj))
      })
      .catch((error) => console.log(error))
  }
  Sauce.findByIdAndUpdate(theId, changeTheSauce)
    .then((sauce) => res.send({message : "The sauce is change1111", sauce}))
    .catch((error) => console.log(error))
  console.log('Sauce Id', theId, req.body)
}

function oneLike(req, res)
{
  const thelike = req.body.like
  Sauce.findOne({_id : req.params.id}).then((sauce) => {
    console.log("****", sauce, "*****")
    if(thelike == 1)
    {
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
      .then(() => {res.status(200).send({message : "+1 Like"})})
      .catch((error) => {res.status(400).send({message : error})})
    }
    else if(thelike == -1)
    {
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id
        })
        .then(() => {res.status(200).send({message : "+1 Dislike"})})
        .catch((error) => {res.status(400).send({message : error})})
    }
    else if(thelike == 0)
    {
      if(sauce.usersLiked.find(user => user === req.body.userId))
      {
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { likes: -1 },
          $pull: { usersLiked: req.body.userId },
          _id: req.params.id
        })
        .then(() => {res.status(200).send({message : "0 Like"})})
        .catch((error) => {res.status(400).send({message : error})})
      }
    }
    if(sauce.usersDisliked.find(user => user === req.body.userId))        
      {
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: req.body.userId },
          _id: req.params.id
        })
        .then(() => {res.status(200).send({message : "0 Like"})})
        .catch((error) => {res.status(400).send({message : error})})
      }
    console.log("*", req.body, "*")
  })
}

router.get('/', checkToken, sauceCrontroller.getSauces)
router.post('/', checkToken, mlt.single("image") , sauceCrontroller.postSauce)
router.get('/:id', checkToken, sauceCrontroller.getSauce)
router.delete('/:id', checkToken, deleteItem)
router.put('/:id', checkToken, mlt.single("image"), updateItem)
router.post('/:id/like', checkToken, oneLike)

module.exports = router