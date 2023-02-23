const Sauce = require("../models/sauce.model");


async function postSauce(req, res)
{
  const infoProduct = req.body.name
  const sauceArray= JSON.parse(req.body.sauce)
  const sauces = [
    {
      userId : sauceArray.userId, 
      name : sauceArray.name,
      manufacturer : sauceArray.manufacturer,
      description : sauceArray.description,
      mainPepper : sauceArray.mainPepper,
      imageUrl : "sauceArray",
      heat : sauceArray.heat,
      likes : 0,
      dislikes : 0,
      usersLiked : [],
      usersDisliked : []
    },
  ];
  Sauce.insertMany(sauces).then((product) => {
    console.log('enregistrer')
    res.send({message: 'Produit enregistré'})
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
    console.log(req.params.id)
    Sauce.findOne({
        _id: req.params.id,
      })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
}

module.exports = { getSauces, postSauce, getSauce}
