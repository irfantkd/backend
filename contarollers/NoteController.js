const { default: mongoose } = require("mongoose");
const NoteModel = require("../models/Note.model.js");




// Search Notes
const searchNotes = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const userid = new mongoose.Types.ObjectId(req.body.userid);
        const notes = await NoteModel.find({ user: userid, title: { $regex: new RegExp(searchQuery, "i") } });

        res.status(200).json({
            error: false,
            notes: notes
            
        })
        
    } catch (error) {
        
    }
}


module.exports = {
    searchNotes
}