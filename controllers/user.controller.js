const validator = require("validator")
const bcrypt = require("bcrypt")

const pool = require("./../database/db-connect")

const generateTokenReponse = (user_id, email) => {
  const token = jwt.sign({
      user_id, email
  }, 'RANDOM_TOKEN_SECRET', {
      expiresIn:"24h"
  });

  return token
}


let controller = {}

// REGISTER
controller.createAccount = async (username, email, password)=>{
  //vérifier l'email
  if(!validator.isEmail(email)){
    return [false, "email is invalid"]
  }

  //vérifier que le username n'est pas déjà utilisé

  try {
    let userExists = await pool.query("SELECT username FROM app_user WHERE username = $1",[username])
  
    if(userExists.rows[0]){
      return [false, "username already used"]
    }
    
  } catch (error) {
      console.log("DEV - userController - createAccount - select username error")
    return [false, "server error"]
  }


  //vérifier que l'email n'est pas déjà utilisé
  try {
    let emailExists = await pool.query("SELECT email FROM app_user WHERE email = $1",[email])
  
    if(emailExists.rows[0]){
      return [false, "email already used"]
    }
  } catch (error) {
      console.log("DEV - userController - createAccount - select email error")
    return [false, "server error"]
  }

  //hasher le password
  try {
    let hashedPassword = await bcrypt.hash(password, 10)
  } catch (error) {
      console.log("DEV - userController - createAccount - bcrypt hash error")
    return [false, "server error"]
  }
  
  //creer la date de creation et de connection
  let registration_date = new Date()
  let last_connection = registration_date

  //verified à false
  let verified = false

  //creer le compte utilisateur
  try {
      await pool.query(`
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
      `,[username, email, hashedPassword, registration_date, last_connection, verified])
      
      return [true, "user account created !"]
    
  } catch (error) {
      console.log("DEV - userController - createAccount - insert bdd error")
    return [false, "server error"]
  }
}


//////////////////////////////////////////////////////////////

// LOGIN
controller.login = async (email, password) => {
  //vérifier l'email
  if(!validator.isEmail(email)){
    return [false, "email is invalid"]
  }


  //vérifier que l'email n'est pas déjà utilisé par qqun d'autre
  let user
  try {
    user = await pool.query("SELECT email FROM app_user WHERE email = $1",[email])
    user = user.rows[0]

    if(!user){
      return [false, "no account with this email"]
    }

  } catch (error) {
      console.log("DEV - userController - createAccount - select email error")
    return [false, "server error"]
  }

  //comparer le password
  try {
    let compare = await bcrypt.compare(password, user.password)
    if(!compare){
      return [false, "password does not match"]
    }
  } catch (error) {
      console.log("DEV - userController - createAccount - bcrypt compare error")
    return [false, "server error"]
  }

  //creer le token
  let token = generateTokenReponse(user.user_id, user.email)

  try {
    await pool.query(`
      UPDATE app_user
      SET last_connection = $2
      WHERE user_id = $1;
    `,[user.user_id, new Date()])

  } catch (error) {
      console.log("DEV - userController - createAccount - update last_connection error")
    return [false, "server error"]
  }
}



module.exports = controller;


