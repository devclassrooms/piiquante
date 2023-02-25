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

function thefile(req, file, e)
{
  e(null, "sauce" + Date.now() + file.originalname)
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
  const changeSauce = req.body.sauce
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
  Sauce.findByIdAndUpdate(theId, changeSauce)
    .then((sauce) => res.send({message : "The sauce is change", sauce}))
    .catch((error) => console.log(error))
  console.log('Sauce Id', theId, req.body)
}

function oneLike(req, res)
{
  const theId = req.params.id
  const thelike = req.body.like;
  const theUserId = req.body.userId
  let theUsersLiked
  if(thelike == 1)
  {
    Sauce.findByIdAndUpdate(theId, {})
    .then((sauce) => {
      console.log ({message : "1 Like", sauce}, sauce.likes)
      let lesLike = Number(sauce.likes + (+1))
      if(sauce.usersLiked != "")
        theUsersLiked = sauce.usersLiked + " " + theUserId
      else
        theUsersLiked =  theUserId
      Sauce.findByIdAndUpdate(theId, {likes : lesLike, usersLiked: theUsersLiked})
        .then(() => {res.send({message : "+1 Like"}).status(200)})
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
  }
  else if(thelike == -1)
  {
    Sauce.findByIdAndUpdate(theId, {})
    .then((sauce) => {
      console.log ({message : "1 Dislike", sauce}, sauce.dislikes)
      let lesDislike = Number(sauce.dislikes + (-1))
      if(sauce.usersDisliked != "")
        theUsersLiked = sauce.usersDisliked + " " + theUserId
      else
        theUsersLiked =  theUserId
      Sauce.findByIdAndUpdate(theId, {dislikes : lesDislike, usersDisliked: theUsersLiked})
        .then(() => {res.send({message : "+1 Dislike"}).status(200)})
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
  }
  else if(thelike == 0)
  {
    res.send({message : "Error likes"}).status(404)
  }
  console.log("*", req.body, "*")
}

router.get('/', checkToken, sauceCrontroller.getSauces)
router.post('/', checkToken, mlt.single("image") , sauceCrontroller.postSauce)
router.get('/:id', checkToken, sauceCrontroller.getSauce)
router.delete('/:id', checkToken, deleteItem)
router.put('/:id', checkToken, mlt.single("image"), updateItem)
router.post('/:id/like', checkToken, oneLike)

module.exports = router