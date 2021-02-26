const router = require('express').Router();
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const Users = require('../users/users-model')

const checkPayload = (req, res, next) => {
  if(!req.body.username || !req.body.password){
      res.status(401).json("username and password required")
  } else {
    next()
  }
}

const checkUserInDb = async (req, res, next)=>{
  try{
    const rows = await Users.findBy({username: req.body.username})
    if(!rows.length){
      next()
    }else{
      res.status(401).json("username taken")
    }
  }catch(e){
    res.status(500).json(`server error: ${e}`)
  }
}

router.post('/register', checkPayload, checkUserInDb, async (req, res) => {
  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
    
  try{
    const hash = bcryptjs.hashSync(req.body.password, 10)
    const newUser = await Users.add({username:req.body.username, password:hash})
    res.status(201).json(newUser)
  }catch(e){
    res.status(500).json({message: e.message})
  }
 

});

router.post('/login', (req, res) => {
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
