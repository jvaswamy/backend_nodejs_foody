const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const validator = require('validator');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.whatIsYourName;

// login user

const loginUser = async (req, res) => {

    const {email,password} = req.body;
    try {
        const user =await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "User does not exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false, message: "Invalid credentials"});
        }

        const token =generateToken(user._id);
        res.json({success:true, message: "Login successful", token});

    } catch (error) {
        res.json({success:false, message: "Error logging in user", error: error.message});
    }

}

// generate JWT token
const generateToken = (userId)=>{
    return jwt.sign({id: userId}, secretKey, {expiresIn: '1d'});
}

// register user
const registerUser = async (req, res) => {
   const { userName, email, password } = req.body;
   try {
    // checking is user already exists
    const existingUser= await userModel.findOne({email});

    if (existingUser) {
        return res.json({success:false, message: "User already exists"});
    }
    //validating email format & strong password
    if(!validator.isEmail(email)){
        return res.json({success:false, message: "Please enter a valid email"});  

    }
    if(password.length <6){
        return res.json({success:false, message: "Password must be at least 6 characters long"});
    }
    // hashing password
   
    const hashedPassword = await bcrypt.hash(password, 10);


    // creating new user
    const newUser = new userModel({
        userName,
        email,
        password: hashedPassword
    });
    const savedUser = await newUser.save();
    
    
    // const token= generateToken(savedUser._id);
    res.json({success:true, message: "User registered successfully"});

   } catch (error) {
     res.json({success:false, message: "Error registering user", error: error.message});
   }    


}

module.exports = {
    loginUser,
    registerUser
}