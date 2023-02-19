const express = require('express');
const userRoutes  = require('./routes/user.route');
const app = express(); 
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require("cors");
const { config } = require('dotenv');
require('dotenv').config();
const webToken = require('jsonwebtoken')
const password = process.env.mpt;
const router = express.Router();
const multer = require('multer')
const stock = multer.diskStorage({destination: "image/", filename: thefile})
const mlt = multer({storage: stock})

function thefile(req, file, e)
{
  e(null, "sauce" + req.body.userId + Date.now() + file.originalname)
}

const sauceShema = new mongoose.Schema({
    userId : String, 
    name : String,
    manufacturer : String,
    description : String,
    mainPepper : String,
    imageUrl : String,
    heat : Number,
    likes : Number,
    dislikes : Number,
    usersLiked : [ "String <userId>" ],
    usersDisliked : [ "String <userId>" ]
})
const sauceItem = mongoose.model("Sauces", sauceShema);

async function postSauce(req, res)
{
  const infoProduct = req.body.name
  const sauceArray= JSON.parse(req.body.sauce)
  console.log(req.body);
  console.log("thefile",req.file);
  console.log("la sauce", sauceArray)
  const sauces = [
    {
      userId : sauceArray.userId, 
      name : sauceArray.name,
      manufacturer : sauceArray.manufacturer,
      description : sauceArray.description,
      mainPepper : sauceArray.mainPepper,
      imageUrl : "sauceArray",
      heat : sauceArray.heat,
      likes : 1,
      dislikes : 1,
      usersLiked : [ "String <userId>" ],
      usersDisliked : [ "String <userId>" ]
    },
  ];
  sauceItem.insertMany(sauces).then((product) => {
    console.log('enregistrer')
    res.send({message: 'Produit enregistré'})
    res.status(200)
  })
}


async function getSauce(req, res)
{
  const sauces = [
    {
      userId : "String", 
      name : "String",
      manufacturer : "String",
      description : "String",
      mainPepper : "String",
      imageUrl : "String",
      heat : 2,
      likes : 2,
      dislikes : 2,
      usersLiked : [ "String <userId>" ],
      usersDisliked : [ "String <userId>" ]
    },
  ];
  sauceItem.find({}).then(product => res.send(product))
  res.status(200)
}

function checkToken(req, res, next)
{
  if((req.header('Authorization')) != "")
  {
    const theToken = req.header('Authorization').split(" ")[1]
    console.log(theToken)
    webToken.verify(theToken, "RANDOM_SECRET");
    //res.send(creatSauce()).status(200);
    next()
    
  }
  else
  {
    res.status(400);
    res.send({message: "Bad token"})
  }
}

async function getSauces(req, res)
{
  sauceItem.find({}).then('check')
}

app.use(cors())

//***********Delet error**********/
mongoose.set('strictQuery', false);
//********************************/

//Connexion avec la Database MOngoDB
mongoose.connect(`mongodb+srv://paste:${password}@cluster0.t4j9fwn.mongodb.net/?retryWrites=true&w=majority`,
{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

console.log("mpt",process.env.mpt);

app.use(bodyParser.json())
app.use('/api/auth/', userRoutes)
app.get('/api/sauces', checkToken, getSauce)
app.post('/api/sauces', checkToken, mlt.single("image") , postSauce)
app.listen(3000, () =>console.log("Listening on port " + 3000));













//https://s3.eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P6/Requirements_DW_P6.pdf
