const bcrypt = require('bcrypt');
const User = require('../models/User')
const jwt = require('jsonwebtoken')

require('dotenv').config();


exports.signup = async (req,res)=>{
    try{
        //get all data from frontend
        const {name,email,password,role} = req.body;
        //check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already Exist"
            })
        }
        
        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashing password"
            })
        }

        //create user
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        res.status(200).json({
            success:true,
            message:"user created successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again later !"
        })
    }
}


exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        //validation on email and password
        if(!email || !password){
            return res.json({
                success:false,
                message:'please fill all the details carefully'
            })
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                messsage:'User is not registered'
            })
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }
        //verify password and generate JWT token
        if(await bcrypt.compare(password,user.password)){
            //password match
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'3d'})

            user = user.toObject();
            user.token = token;
            user.password = undefined;
            

            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
                path:'/'
            }

            //set cookie for 3 day it store in browser 
            console.log(user)
            return res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'user logged in successfully'
            })

        }
        else{
            return res.status(403).json({
                success:false,
                message:'password Incorrect'
            })
        }
    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:err.message,
            message:'Error while login'
        })
    }
}