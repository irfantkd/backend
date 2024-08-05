const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile } = require('../contarollers/UserController.js'); // Corrected 'contarollers' to 'controllers'
const multer = require("multer");
const AuthCheck = require("../middleware/Auth.middleware.js")

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.mimetype.split("/")[1]; // Corrected 'etx' to 'ext'
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    }
});
const upload = multer({ storage: storage });

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Upload files in Node.js
router.put("/update-profile", [upload.single('image'), AuthCheck], updateProfile);

module.exports = router;
