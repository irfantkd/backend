const UserModel = require("../models/User.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const cloudinary = require ('cloudinary').v2;

env = dotenv.config();


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SERVER,
    secure: true,
});


// User Register
const registerUser = async (req, res) => {
    try {
        const { name, email, photo, password, gender } = req.body;

        // check user is already registered?
        const alreadyRegister = await UserModel.findOne({ email: email });
        console.log(alreadyRegister);
        if (alreadyRegister !== null) {
            return res.status(200).json({
                error: true,
                message: "User alrady registered"
            })
        }



        // hash the password
        const hashed = await bcrypt.hash(password, 15)
        console.log(hashed);

        // save user

        const user = await UserModel.create({ name: name, email: email, password: hashed, photo: photo, gender: gender })
        // generate jwt token

        // send success response

        res.status(200).json({
            error: false,
            User: user,
            message: "user successfully added"
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true
        })

    }

} 


// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user is registered or not
        const user = await UserModel.findOne({ email: email });
        if (user === null) {
            return res.status(200).json({
                error: true,
                message: "user or password is incorrect"
            })
        }

        const isPasswordcorect = await bcrypt.compare(password, user.password)
        if (isPasswordcorect === false) {
            return res.status(200).json({
                error: true,
                message: "Username password is incorrect",
            })
        }

        //todo JWT token
        // we are generating jwt token for authentication, and giving it expiry of 1 hour.
        const access_token = await jwt.sign({ userid: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // send success response
        res.status(200).json({
            error: false,
            message: "Succesfully logdin",
            access_token: access_token,
            user: { name: user.name, photo: user.photo, email: user.email }
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            message: "enteral server error"
        })

    }
}

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const name = req.body.name;
        const image = req.file.filename;
        const userid = req.body.userid;
        const cloudinaryImage = await cloudinary.uploader.upload(req.file.path)
        
        const updateUser = await UserModel.findByIdAndUpdate(userid, { name: name, photo: cloudinaryImage.url }, { new: true })
        const docWithGetters = updateUser.toObject({ getters: true });
        return res.status(200).json({
            errer: false,
            user: docWithGetters,
            message: "successfully uploaded"
        })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            error: true,
            message: "internal server error"
        })

    }
}






module.exports = {
    registerUser,
    loginUser,
    updateProfile
}