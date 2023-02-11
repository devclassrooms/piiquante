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

function checkToken(req, res)
{
  if((req.header('Authorization')) != "")
  {
    const theToken = req.header('Authorization').split(" ")[1]
    console.log('abc', theToken)
    webToken.verify(theToken, "abc");
    res.status(200);
    res.send("ok")
  }
  else
  {
    res.status(400);
    res.send({message: "Bad token"})
  }
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
app.use('/api/sauces', checkToken)
app.listen(3000, () =>console.log("Listening on port " + 3000));













//https://s3.eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P6/Requirements_DW_P6.pdf
