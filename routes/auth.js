const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middelware/fetchuser');

const JWT_secret ="Rishabh&inotebook";

router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email is already Registered" });
      }

      const salt = bcrypt.genSaltSync(10);
      const securepass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: securepass,
        email: req.body.email,
      });

      const data ={
        user:{
          id: user.id
        }
      }

      const authtoken = jwt.sign(data,JWT_secret);
      console.log(authtoken);

      res.json({authtoken});
    } catch (error) {
      console.log(error);
      res.status(500).send("Some Error Occurd");
    }
  }
);


router.post("/login",[
  body('email','email is not valid').isEmail(),
  body('password','Password can not be blank').exists(),
],async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error : "Try to login with correct credential"});
    }
    const passcom = await bcrypt.compare(password,user.password);
    if(!passcom){
      return res.status(400).json({error : "Try to login with correct credential"});
    }

    const data ={
      user:{
        id: user.id
      }
    }

    const authtoken = jwt.sign(data,JWT_secret);
    console.log(authtoken);
    res.json({authtoken});

  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occurd");
  }
})


router.post("/getuser",fetchuser,[
  body('email','email is not valid').isEmail(),
  body('password','Password can not be blank').exists(),
],async(req,res)=>{

  try {
    const userId =req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Some Error Occurd");
  }
});

module.exports = router;
