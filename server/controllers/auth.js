import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGFISTER USER
export const register = async (req, res) => {  // this callback function is asyn because we are going to call mongoose database
    try{
        const {
            firstName, 
            lastName,
            email,
            password,
            picturePath,
            friends, 
            location,
            occupation
        } = req.body;  // we are stucturing these parameters ^ from the request body 

        const salt = await bcrypt.genSalt(); // using salt to encrypt our password 
        const passwordHash = await bcrypt.hash(password, salt); 

        const newUser = new User({
            firstName, 
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends, 
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // send the user a status code of 201 which means something has been created 
    }
    catch(err){
        res.status(500).json({error: err.message}); // status 500 means something went wrong
    }
};

// LOGGING IN
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if(!user) return res.status(400).json({ msg: "User does not exist. "}); // if email is inproper then this error wil show up

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials. "});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // write secret string in env file
        delete user.password; // delet password so it doesnt get sent to the frontend
        res.status(200).json({ token, user });

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};