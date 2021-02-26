const router = require('express').Router();
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const Users = require('../users/users-model')
const  {jwtSecret}  = require("./secrets")

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

const isValid = user => {
  return Boolean(user.username && user.password)
}

router.post('/register', checkPayload, checkUserInDb, async (req, res) => {
  if(isValid(req.body)){
    try{
      const hash = bcryptjs.hashSync(req.body.password, 10)
      const newUser = await Users.add({username:req.body.username, password:hash})
      res.status(201).json(newUser)
    }catch(e){
      res.status(500).json({message: e.message})
    }
  }else{
    res.status(400).json("username and password required")
  }
  
  
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(isValid(req.body)){
    Users.findBy({username: username})
    .then(([user])=>{
      if(user && bcryptjs.compareSync(password, user.password)){
        const token = makeToken(user)
        res.status(200).json({
          message: `welcome, ${user.username}`,
          token: token
        })
      } else {
        res.status(401).json({message: 'invalid credentials'})
      }
    })
  }else{
    res.status(400).json("username and password required")
  }
});

function makeToken(user){
  const payload = {
    subject:user.id,
    username:user.username
  }
  const options = {
    expiresIn: "1000s"
  }
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;