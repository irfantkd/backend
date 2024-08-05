const express = require('express');
const router = express.Router();
const AuthCheck = require("../middleware/Auth.middleware.js");
const { searchNotes } = require('../contarollers/NoteController.js');




router.get("/search", AuthCheck, searchNotes);






module.exports = router;