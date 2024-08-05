const express = require('express')
const app = express()
const dotenv = require('dotenv')
const NoteModel = require("./models/Note.model.js")

const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const AuthCheck = require("./middleware/Auth.middleware.js")
const cors = require("cors");
const Notemodule = require('./models/Note.model.js')
const userRoutes = require("./routes/User.routes.js")
const noteRoutes = require("./routes/Notes.routes.js")
dotenv.config();

// const bcrypt = require('bcrypt');
const port = 3003

// middlewarw
app.use(express.json());
app.use(cors());
// ------------------------------------------------------------------------------------------------------------------
app.use(express.static('uploads'))




app.get("/", (req, res) => {
    return res.send("helloo");
})





// User Routers
app.use("/user", userRoutes)

// Notes Routers
app.use("/note", noteRoutes)




// create a new note

app.post("/notes", AuthCheck, async (req, res) => {
    try {
        const { title, content, userid } = req.body;

        // converting normal string in to mongodb object id
        const userIdobject = new mongoose.Types.ObjectId(userid);
        const newnote = await NoteModel.create({ title: title, content: content, user: userIdobject });

        return res.status(201).json({
            error: false,
            message: "successfully  created",
            note: newnote
        })



    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            message: "enteral server error"
        })
    }

})
// isPinned

app.put("/ispinned/:id", AuthCheck, async (req, res) => {
    try {
        const noteid = req.params.id
        const { isPinned, userid } = req.body
        const findnote = await NoteModel.findById(noteid);
        if (!findnote) {
            return res.status(404).json({
                error: true,
                message: 'This Note is not found'
            })
        }
        console.log(findnote.user.toString());

        if (userid === findnote.user.toString()) {

            const updateispinned = await NoteModel.findByIdAndUpdate(noteid, { isPinned: isPinned }, { new: true })
            res.status(200).json({
                error: false,
                message: updateispinned,
            })
        } else {
            res.status(403).json({
                error: true,
                message: "You are not authorized"
            })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            message: "entarnal server error"
        })

    }
})
// get all notes of logged in user
app.get("/notes/me/:type?", AuthCheck, async (req, res) => {
    try {

        const type = req.params.type
        const userid = new mongoose.Types.ObjectId(req.body.userid);

        let query = { user: userid, isPinned: false };
        if (type) {
            query[type] = true;
        }
        const notes = await NoteModel.find(query)

        res.status(200).json({
            error: false,
            notes: notes

        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            messsaage: "enteral server error"
        })

    }

})



app.put("/notes/:id", AuthCheck, async (req, res) => {
    try {

        const noteid = req.params.id;
        const { userid } = req.body;

        const userobjectid = new mongoose.Types.ObjectId(userid);

        const findnote = await NoteModel.findOne({
            _id: noteid,
            user: userobjectid
        })


        if (findnote === null) {
            res.status(404).json({
                error: true,
                message: "not found or not authorize to update"
            })
        }


        // updating
        // await findnote.find(req.body, { new: true });
        const udpatedNote = await NoteModel.findByIdAndUpdate(noteid, req.body, { new: true });
        res.status(200).json({
            error: false,
            note: udpatedNote
        })

        // const updatednote = await NoteModel.findByIdAndUpdate(noteid, req.body, { new: true })
        // console.log(updatednote);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            message: "enternal server error"

        })

    }
})

app.delete("/notes/:id", AuthCheck, async (req, res) => {
    try {
        const noteid = req.params.id;
        const { userid } = req.body
        // const findnote = await NoteModel.findById(noteid)

        // console.log(userid);

        const userObjectId = new mongoose.Types.ObjectId(userid);

        // find the note by user
        const findnote = await NoteModel.findOne({
            _id: noteid,
            user: userObjectId
        });



        if (findnote === null) {
            return res.status(404).json({
                error: true,
                message: "Note not found or you are not authorized to delete"
            })
        }
        await findnote.deleteOne();

        res.status(200).json({
            error: false,
            message: "successfully deleted"
        })


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            message: "enteral server error"
        })

    }


})

// Pinned note
app.put('/note/ispinned/:id', AuthCheck, async (req, res) => {
    try {
        const noteId = req.params.id;
        const { userid } = req.body;
        const userobjectid = new mongoose.Types.ObjectId(userid)

        const foundNotes = await Notemodule.findOne({
            _id: noteId,
            user: userobjectid
        })
        if (foundNotes == null) {
            res.status(404).json({
                error: true,
                mesage: "not found or authorization is faild"
            })
        }



        const updateNote = await Notemodule.findByIdAndUpdate(noteId, { isPinned: req.body.isPinned }, { new: true });

        res.status(200).json({
            error: false,
            message: "Successfully updated",
            note: updateNote,

        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: true,
            message: "interal server error"
        })

    }
})

// authenticate jwt token verify token

app.post("/user/verify", async (req, res) => {
    try {
        const token = req.body.token;
        await jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            error: false
        })
    } catch (error) {
        console.log(error.message);
        res.status(401).json({
            error: true,
        })

    }

})









// mongoose.connect("mongodb://localhost:27017/notydb").then(() => {
//     app.listen(port, () => console.log("server & db is up..."));
// })

mongoose.connect(process.env.MDB_SERVER_URL).then(() => {
    app.listen(port, () => console.log("server & db is up..."));
})

// mongoose.connect(process.env.MONGO_DB_URL).then(() => {
//     app.listen(port, () => console.log("server & db is up..."));
// });

// const mongoUri = process.env.MDB_SERVER_URL;
// if (!mongoUri) {
//     throw new Error('MDB_SERVER_URL is not defined in environment variables');
// }

// mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         app.listen(port, () => console.log("Server & DB are up..."));
//     })
//     .catch((err) => {
//         console.error('Error connecting to MongoDB:', err);
//     });