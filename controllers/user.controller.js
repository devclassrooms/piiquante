const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;


async function signUp(req, res) {
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    console.log(passwordHash);
    const user = new User({
        email: req.body.email,
        password: passwordHash//req.body.password
    });
    user.save().then(() => {
        res.status(200).send('sign up successfull')

    }).catch((error) => { console.error(error); res.status(500).send("error inconu") })

}

async function generateJWT(id) {
    const theToken = jwt.sign({ userId: id }, "RANDOM_SECRET", { expiresIn: "24h" })
    console.log(theToken);
    return (theToken);
}

async function login(req, res) {
    const user = await User.findOne({ email: req.body.email })
    if(!user)
    {
        res.status(400).send('utilisateur inexistant')
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    console.log(isPasswordCorrect);
    if (isPasswordCorrect == true) {
        const tokenId = await generateJWT(user._id)
        res.status(200).send({ userId: user._id, token: tokenId })
        //res.send("Login connection reussi")
    }
    if (isPasswordCorrect == false) {
        res.status(400).send("erreur connection refusé")
    }
    console.log("heeeeeeyyy")
}

module.exports = { signUp, login }
