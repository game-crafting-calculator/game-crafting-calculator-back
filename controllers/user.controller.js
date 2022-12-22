const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//email handler
const nodemailer = require("nodemailer");
//email generator
const mailGen = require("mailgen");
//env variables
require("dotenv").config();

const pool = require("./../database/db-connect");
const { getMaxListeners } = require("../app");

const generateTokenReponse = (user_id, email) => {
  const token = jwt.sign(
    {
      user_id,
      email,
    },
    "RANDOM_TOKEN_SECRET",
    {
      expiresIn: "24h",
    }
  );

  return token;
};

//send mail from testing account
async function main() {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Successfully Register with us", // plain text body
    html: "<b>Successfully Register with us</b>", // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "you should receive an email",
        info: info.messageId,
        prewiew: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
}

//send mail from real gmail account
const getbill = (requ, res) => {
  let config = {
    Service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  };

  let transporter = nodmailer.createTransport(config);
  let MailGenerator = new MailGen({
    theme: "defaut",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name,
      intro: "Your bill has arrived!",
      table: {
        data: "Nodemailer Stack Book",
        description: "A Backend application",
        price: "$10.99",
      },
    },
  };

  res.status(201).json("getBill Successfully...!");
};

// //nodemailer stuff
// const transporter = await nodemailer.createTransport({
//   service: "zohomail",
//   auth: {
//     user: process.env.AUTH_EMAIL,
//     pass: process.env.AUTH_PASS,
//   },
// });

// //testing success
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("Not ready for messages", error);
//   } else {
//     console.log("Ready for messages", success);
//   }
// });

let controller = {};
/*--------------------------------------------------------------------------------

------------------------------------REGISTER--------------------------------------

----------------------------------------------------------------------------------*/

controller.createAccount = async (username, email, password) => {
  //vérifier l'email
  if (!validator.isEmail(email)) {
    return [false, "email is invalid"];
  }

  //vérifier que le username n'est pas déjà utilisé

  try {
    let userExists = await pool.query(
      "SELECT username FROM app_user WHERE username = $1",
      [username]
    );

    if (userExists.rows[0]) {
      return [false, "username already used"];
    }
  } catch (error) {
    console.log(
      "DEV - userController - createAccount - select username error",
      error
    );
    return [false, "server error"];
  }

  //vérifier que l'email n'est pas déjà utilisé
  try {
    let emailExists = await pool.query(
      "SELECT email FROM app_user WHERE email = $1",
      [email]
    );

    if (emailExists.rows[0]) {
      return [false, "email already used"];
    }
  } catch (error) {
    console.log("DEV - userController - createAccount - select email error");
    return [false, "server error"];
  }

  //hasher le password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(
      "DEV - userController - createAccount - bcrypt hash error\n",
      error
    );
    return [false, "server error"];
  }

  //creer la date de creation et de connection
  let registration_date = new Date();
  let last_connection = registration_date;

  //verified à false
  let verified = false;

  //creer le compte utilisateur
  try {
    await pool.query(
      `
        INSERT INTO app_user (
          username,
          email,
          password,
          registration_date,
          last_connection,
          verified
        )
        VALUES(
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )
      `,
      [
        username,
        email,
        hashedPassword,
        registration_date,
        last_connection,
        verified,
      ]
    );

    return [true, "user account created !"];
  } catch (error) {
    console.log(
      "DEV - userController - createAccount - insert bdd error\n",
      error
    );
    return [false, "server error"];
  }
};

/*--------------------------------------------------------------------------------

---------------------------------------LOGIN--------------------------------------

----------------------------------------------------------------------------------*/

controller.login = async (email, password) => {
  //vérifier l'email
  if (!validator.isEmail(email)) {
    return [false, "email is invalid"];
  }

  //vérifier que l'email n'est pas déjà utilisé par qqun d'autre
  let user;
  try {
    user = await pool.query(
      "SELECT user_id, email, password FROM app_user WHERE email = $1",
      [email]
    );
    user = user.rows[0];

    if (!user) {
      return [false, "no account with this email"];
    }
  } catch (error) {
    console.log("DEV - userController - createAccount - select email error");
    return [false, "server error"];
  }

  //comparer le password
  try {
    let compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return [false, "password does not match"];
    }
  } catch (error) {
    console.log("DEV - userController - createAccount - bcrypt compare error");
    return [false, "server error"];
  }

  //creer le token
  console.log({ user });
  let token = generateTokenReponse(user.user_id, user.email);

  //update last_connection for the user
  try {
    await pool.query(
      `
      UPDATE app_user
      SET last_connection = $2
      WHERE user_id = $1;
    `,
      [user.user_id, new Date()]
    );
  } catch (error) {
    console.log(
      "DEV - userController - createAccount - update last_connection error"
    );
    return [false, "server error"];
  }

  return [token, ""];
};

/*--------------------------------------------------------------------------------

-------------------------------------GET PROFILE----------------------------------

----------------------------------------------------------------------------------*/

controller.getProfile = async (user_id) => {
  let user;
  try {
    user = await pool.query(
      `SELECT username, email, registration_date, last_connection FROM app_user WHERE user_id = $1`,
      [user_id]
    );
  } catch (error) {
    console.log("DEV - userController - getProfile - select profile\n", error);
  }

  user = user.rows[0];

  if (!user) {
    return [false, "user does not exsits"];
  }

  return [user, ""];
};

/*--------------------------------------------------------------------------------

-----------------------------------UPDATE PROFILE---------------------------------

----------------------------------------------------------------------------------*/

controller.updateProfile = async (user_id, username, password) => {
  //find user
  let user;
  try {
    user = await pool.query(
      `SELECT username, email, password FROM app_user WHERE user_id = $1`,
      [user_id]
    );
  } catch (error) {
    console.log("DEV - userController - getProfile - select profile\n", error);
  }

  user = user.rows[0];

  //hash the password if it exists, override it if not

  let hashedPassword;
  if (password) {
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.log("DEV - userController - update - bcrypt hash error\n", error);
      return [false, "server error"];
    }
  } else {
    hashedPassword = user.password;
  }

  //ovverride username if it does not exists
  username = username || user.username;

  try {
    await pool.query(
      `
      UPDATE app_user
      SET
        username = $2,
        password = $3
      WHERE user_id = $1;
  `,
      [user_id, username, hashedPassword]
    );
  } catch (error) {
    console.log("DEV - userController - update - pg update error\n", error);
    return [false, "server error"];
  }

  return [true, ""];
};

/*--------------------------------------------------------------------------------

-----------------------------------DELETE PROFILE---------------------------------

----------------------------------------------------------------------------------*/

controller.deleteAccount = async (user_id) => {
  let deletedUser;
  try {
    deletedUser = await pool.query(`DELETE FROM app_user WHERE user_id = $1`, [
      user_id,
    ]);
  } catch (error) {
    console.log(
      "DEV - userController - deleteProfile - delete profile\n",
      error
    );
    return [true, "server error"];
  }

  if (deletedUser.rowCount === 0) {
    return [false, "user does not exists"];
  }

  return [true, ""];
};

module.exports = controller;
