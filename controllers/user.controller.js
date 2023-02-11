const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const saltRounds = 10;


async function signUp(req, res)
{
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    console.log(passwordHash);
    const user = new User({
        email: req.body.email,
        password: passwordHash//req.body.password
    });
    user.save().then(() => {
        console.log(user);
    
    }).catch(() => {console.log('error')})
        
}

async function generateJWT(theEmail, password)
{
    const theToken = jwt.sign({email: theEmail}, password, {expiresIn: "4h"})
    console.log(theToken);
    return(theToken);
}

async function userLogin(req, res)
{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    const findObjectDB = await User.findOne({email: req.body.email})
    console.log(findObjectDB.password);
    const checkTrue = await bcrypt.compare(req.body.password, findObjectDB.password);
    console.log(checkTrue);
    if(checkTrue == true)
    {
        res.status(200);
        const tokenId = await generateJWT(req.body.email, req.body.password)
        res.send({userId: user._id, token: tokenId})
       //res.send("Login connection reussi")
    }
    if(checkTrue == false)
    {
        res.send("erreur connection refusé")
        res.status(400);
    }
    console.log("heeeeeeyyy")
}

module.exports = {signUp, userLogin}
