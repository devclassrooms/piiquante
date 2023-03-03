const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

async function generateJWT(id) {
    const theToken = jwt.sign({ userId: id }, "RANDOM_SECRET", { expiresIn: "24h" })
    return (theToken);
}

async function signUp(req, res) {
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    const user = new User({
        email: req.body.email,
        password: passwordHash
    });
    user.save().then(() => {
        res.status(200).send({message:'sign up successfull'})

    }).catch((error) => { console.error(error); res.status(500).send("error inconu") })

}


async function login(req, res) {
    const user = await User.findOne({ email: req.body.email })
    if(!user)
    {
        res.status(400).send('utilisateur inexistant')
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (isPasswordCorrect == true) {
        const tokenId = await generateJWT(user._id)
        res.status(200).send({ userId: user._id, token: tokenId })
    }
    if (isPasswordCorrect == false) {
        res.status(400).send("erreur connection refusé")
    }
}

module.exports = { signUp, login }
