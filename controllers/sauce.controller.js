const Sauce = require("../models/sauce.model");


async function postSauce(req, res)
{
  const infoProduct = req.body.name
  const sauceArray= JSON.parse(req.body.sauce)
  const localhost = "http://localhost:3000/"
  const theImageUrl = localhost + req.file.destination + req.file.filename;
  const sauces = [
    {
      userId : sauceArray.userId, 
      name : sauceArray.name,
      manufacturer : sauceArray.manufacturer,
      description : sauceArray.description,
      mainPepper : sauceArray.mainPepper,
      imageUrl : theImageUrl,
      heat : sauceArray.heat,
      likes : 0,
      dislikes : 0,
      usersLiked : [],
      usersDisliked : []
    },
  ];
  Sauce.insertMany(sauces).then((product) => {
    res.send({message: 'Produit enregistrĂ©'})
    res.status(200)
  })
}


async function getSauces(req, res)
{
  Sauce.find({}).then(product => res.send(product))
  res.status(200)
}


async function getSauce(req, res)
{
    Sauce.findOne({
        _id: req.params.id,
      })
        .then((sauce) => {
          if(sauce == null)
          {
            res.status(400).json(sauce)
          }
          else
            res.status(200).json(sauce)
        })
        .catch((error) => res.status(404).json({ error }));
}

module.exports = { getSauces, postSauce, getSauce}
