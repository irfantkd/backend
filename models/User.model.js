const mongoose = require("mongoose");



const userschema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        require:true,
    },
    password: {
        type: String,
        required:true,
    },
    photo: {
        type: String,
        default: "dummydp.jpg",
        // get: attachServerUrlPhoto
    },
    gender: {
        type: String,
        enum:["male", "female"]
    },
    isActive: {
        type: Boolean,
        default:true
    },
    isAdmin:     {
        type: Boolean,
        default:false
    }
    
    
}, { timestamps: true })

// getter
function attachServerUrlPhoto(value) {
    return process.env.SERVER_URL + value;
}

const UserModel = mongoose.model("User", userschema);
module.exports = UserModel;