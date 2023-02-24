const express = require('express');
const userRoutes  = require('./routes/user.route');
const sauceRoutes  = require('./routes/sauce.route');
const app = express(); 
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require("cors");
const { config } = require('dotenv');
require('dotenv').config();


const password = process.env.mpt;

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

app.use('/image', express.static('./image'))//rendre accessible avec express le dossier image
app.use(bodyParser.json())
app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

app.listen(3000, () =>console.log("Listening on port " + 3000));













//https://s3.eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P6/Requirements_DW_P6.pdf
