//Password handler
const bcrypt = require ('bcrypt');

//Token handler
const jwt = require ('jsonwebtoken');
const { findOneAndUpdate } = require('../models/User');

//MongoDB user model
const UserModel = require('../models/User');

// // env variables
// require("dotenv").config();



// const { router } = require('../app');


//path for static verified page
// const path = require("path");
// const { log } = require('console');

// const nodeMailerUser = require("./nodeMailerUser");



//Signup
// exports.signup = (req, res, next) => {
//     bcrypt.hash(req.body.password, 10)
//     .then(hash => {
//         const user = new User({
//             username:req.body.username,
//             email: req.body.email,
//             password: hash,
//             registration_date: Date.now(),
//             last_connection: Date.now(),
//             verified: false
//         });
//         user.save()
//         .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
//         // handle accout verification
//     //         .then((result) => {
//     //             nodeMailerUser.sendVerificationEmail(result, res);
//     //         })
//     //         .catch(error => res.status(400).json({ error }));
//         })
//         .catch(error => res.status(500).json({ error }));
// };

// REGISTER
exports.signup = async (req, res) => {
    let {email, username, password} = req.body;
    
    let user = await UserModel.findOne({email});
        if (user) {
            res.status(400).send("User is already exist, please login!");
        };
    
    let hashPassword = await bcrypt.hash(password, 10);
    
    try {
        const newUser = new User({
            username:req.body.username,
            email: req.body.email,
            password: hashPassword,
            registration_date: Date.now(),
            last_connection: Date.now(),
            verified: false
        })

        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenReponse(dbUser));
        res.status(201).json({message: 'Utilisateur créé !'});

        // handle account verification
    //         .then((result) => {
    //             nodeMailerUser.sendVerificationEmail(result, res);
    //         })
    //         .catch(error => res.status(400).json({ error }));

    
    } catch (error) {
        res.status(500).json({ error })
    }
}



//Login
// exports.login = (req, res, next) => {
//     UserModel.findOne({email: req.body.email})
//     .then(user => {
//         if (user === null) {
//             res.status(401).json({ message : 'Identifiant/mot de passe incorrect'});
//         } else {

//             // if (!data[0].verified) {
//             //     res.status(400).json({message: "Email hasn't been verified yet. Check your inbox."});
//             // } else {
                
//                 bcrypt.compare(res.body.password, user.password)
//                 .then(valid => {
//                     if(!valid) {
//                         res.status(401).json({ message: 'Identifiant/mot de passe incorrect' });
//                     } else {
//                        res.status(200).json({
//                         userId: user._id,
//                         token: jwt.sign(
//                             { userId: user._id },
//                             'RANDOM_TOKEN_SECRET',
//                             { expiresIn: '24h'}
//                         )
//                        }); 
//                     }
//                 })
//                 .catch(error => {
//                     res.status(500).json({ error });
//                 })
//             // }
//         }
//     })
//     .catch(error => {
//         res.status(500).json({ error });
//     })
// };

// LOGIN
exports.login = async (req, res, next) => {

    let {email, password} = req.body
    
    let user;
    try {
        user = await UserModel.findOne({email})
        if (user === null) {
            res.status(401).json({ message : 'Identifiant/mot de passe incorrect'});
            return false;
        }

        // if (!user.verified) {
        //     res.status(400).json({message: "Email hasn't been verified yet. Check your inbox."});
        //     return false;   
        // }
        
        // UserModel.findOneAndUpdate({id: "1"}, {last_connection:Date.now()})
        
    } catch (error) {
        res.status(500).json({ error, type:"mongo" });
        return false;
    }

    
    try {
        console.warn(password, user.password);
        let valid  = res.send(generateTokenReponse(user));
        if (!valid) {
            res.status(401).json({ message: 'Identifiant/mot de passe incorrect' });
            return false;
        }
    } catch (error) {
        res.status(500).json({ error, type:"bcrypt" });
        return false;
    }

    // res.status(200).json({
    //     userId: user._id,
    //     token: jwt.sign(
    //         { userId: user._id },
    //         'RANDOM_TOKEN_SECRET',
    //         { expiresIn: '24h'}
    //     )
    // })

    return true;
}

// DELETE
exports.deleteUser = async (req, res) => {
    let user = await UserModel.findOne({ _id: req.params.id});
    try { 
        if (user.userId != req.auth.userId) {
            res.status(401).json({ message: 'Refused !'});
            return false;
        } else {
            await UserModel.deleteOne({_id: req.params.id});
                try{
                    res.status(200).json({ message: 'User delete !'})
                } catch (error) { 
                    res.status(400).json({error})
            }  
        }
    } catch (error) {
        res.status(400).json({ error, type:"delete user" });
    };
}

// MODIFY
exports.modifyUser = async (req, res) => {
    let user = UserModel.findOne({ _id: req.params.id});
    try {
        if (user.userId != req.auth.userId) {
            res.status(401).json({ message: 'Refused !'});
            return false;
        } else {
            await UserModel.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id });
            res.status(200).json({ message: 'Object modify !'})
        }
    } catch (error) { 
        res.status(400).json({error})
    }   
}

exports.getFavoris = async (req, res) => {
    try {
        const favorisTab = await UserModel.findOne(req.params.favoris)
        res.send(favorisTab)
        res.status(200).json({favorisTab})
    } catch (error) {
        res.status(400).json({error, type: "favoris"})
    }
}

// TOKEN
const generateTokenReponse = (user) => {
    console.log("--------------------",user);
    const token = jwt.sign({
        id: user.id, email: user.email
    }, 'RANDOM_TOKEN_SECRET', {
        expiresIn:"24h"
    });

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        registration_date: user.registration_date,
        last_connection: user.last_connection,
        token: token
    };
}

exports.getProfile = async (req, res) => {
    const userId = req.auth.userId
    try {
        const user = await UserModel.findOne({_id: userId})
        if (user === null) {
            res.status(401).json({ message : 'error'});
            return false;
        }

        const {username, email, registration_date, last_connection} = user
        res.json({username, email, registration_date, last_connection})
        
        
    } catch (error) {
        res.status(500).json({ error, type:"mongo" });
        return false;
    }
}

// exports.getUser = async (req, res) => {
//     const tokenId = req.auth.userId;
//     return : tokenId
// }