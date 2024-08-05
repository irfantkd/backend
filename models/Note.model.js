const mongoose = require("mongoose");


const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isArchive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notemodule = mongoose.model("Note", notesSchema);
module.exports = Notemodule