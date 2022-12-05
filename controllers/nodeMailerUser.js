// //unique string
// const{v4: uuidv4} = require('uuid');

// //email handler
// const nodemailer = require('nodemailer');

// //MongoDB user verification model
// const UserVerification = require('../models/UserVerification');

// const sendVerificationEmail =require('../routes/nodeMailerUser')

// //nodemailer stuff
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASS,
//     }
// });

// //testing success
// transporter.verify((error, success) => {
//     if(error) {
//         console.log(error);
//     } else {
//         console.log("Ready for messages");
//         console.log(success);
//     }
// });



// //send verification email
// const sendVerificationEmail = ({_id, email}, res) => {
//     // url to be used in the email
//     const currentUrl = "http://localhost:5000/";

//     const uniqueString = uuidv4() = _id;

//     //mail options
//     const mailOptions = {
//         from: process.env.AUTH_EMAIL,
//         to: "Verify Your Email",
//         html:`<p>Verify your email address to complete the signup and login into your account.</p><p>This link 
//         <b>expires in 6 hours</b>.</p><p>Press <a href=${
//             currentUrl + "user/verify/" + _id + "/" + uniqueString
//         }>here</a> to proceed.</p>`,
//     };

//     //hash the uniqueString
//     const saltRounds = 10;
//     bcrypt
//         .hash(uniqueString, saltRounds)
//         .then((hashedUniqueString) => {
//             //set values in userVerification collection
//             const newVerification = new UserVerification({
//                 userId: _id,
//                 uniqueString: hashedUniqueString,
//                 createdAt: Date.now(),
//                 expiresAt: Date.now() + 21600000,
//             });

//             newVerification
//             .save()
//             .then(() => {
//                 transporter
//                     .sendMail(mailOptions)
//                     .then(() => {
//                         //email sent and verification record saved
//                         res.status(200).json({message: "Verification email sent!"})
//                     })
//                     .catch((error) => {
//                         console.log(error);
//                         res.status(500).json({ error, message:"Verification mail failed!"});
//                     })
//             })
//             .catch(error => {
//                 console.log(error);
//                 res.status(500).json({ error, message:"Couldn't save verification email data!"});
//             })
//         })
//         .catch(error => {
//             res.status(500).json({ error, message:"An error occurred while hashing email data!"});
//         });
// };

// // verify email
// router.get("/verify/:userId/:uniqueString", (req, res) => {
//     let {userId, uniqueString} = req.params;

//     UserVerification
//         .find({userId})
//         .then((result) => {
//             if (result.lenth > 0) {
//                 // user verification record exists so we proceed

//                 const {expiresAt} = result[0];
//                 const hashedUniqueString = result[0].uniqueString;

//                 // checking for expired unique string
//                 if (expiresAt < Date.now()) {
//                     //record has expired so we delete it
//                     UserVerification
//                         .deleteOn({ userId })
//                         .then(result => {
//                             User
//                               .deleteOne({_id: userId})
//                               .then(() => {
//                                 let message = "Link has expired. Please sign up again";
//                                 res.redirect(`/user/verified/error=true&message=${message}`);
//                               })
//                               .catch(error => {
//                                 let message = "Clearing user with expired unque string failed";
//                                 res.redirect(`/user/verified/error=true&message=${message}`);
//                               })
//                         })
//                         .catch((error) => {
//                             console.log(error);
//                             let message = "An error occurred while clearing expired user verification record";
//                             res.redirect(`/user/verified/error=true&message=${message}`);
//                         })
//                 } else {
//                     // valid record exists so we validate the user string
//                     //First compare the hashed unique string

//                     bcrypt
//                     .compare(uniqueString, hashedUniqueString)
//                     .then(result => {
//                         if (result) {
//                             //strings match

//                             User
//                                 .updateOne({_id: userId}, {verified: true})
//                                 .then(() => {
//                                     UserVerification
//                                         .deleteOne({userId})
//                                         .then(() => {
//                                             res.sendFile(path.join(__dirname, "./../views/verified.html"));
//                                         })
//                                         .catch(error => {
//                                             console.log(error);
//                                             let message = "An error occurred while finalizing successful verification.";
//                                             res.redirect(`/user/verified/error=true&message=${message}`);
//                                         })

//                                 })
//                                 .catch(error => {
//                                     console.log(error);
//                                     let message = "An error occurred while updating user record to show verified.";
//                                     res.redirect(`/user/verified/error=true&message=${message}`);
//                                 })

//                         } else {
//                             // existing record but incorrect verification details passed.
//                             let message = "Invalid verification details passed. Check your inbox";
//                             res.redirect(`/user/verified/error=true&message=${message}`);
//                         }
//                     })
//                     .catch(error => {
//                         let message = "An error occurred while comparing unique strings.";
//                         res.redirect(`/user/verified/error=true&message=${message}`);
//                     })
//                 }
//             } else {
//                 // user verification record doesnt't exist
//                 let message = "Account record doesn't exist or has been verified already. Please sign up or log in.";
//                 res.redirect(`/user/verified/error=true&message=${message}`);
//             }
//         })
//         .catch((error) => {
//             console.log(error);
//             let message = "An error occurred while checking for existing user verification record";
//             res.redirect(`/user/verified/error=true&message=${message}`);
//         })
// });

// //Verified page route
// router.get("/verified", (req, res) => {
//  res.sendFile(path.join(__dirname, "./../views/verified.html"));
// })

// module.exports = nodeMailerUser;