const Note = require('../models/Note');
const User = require('../models/User');

const getNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const userNotes = await Note.find({ user: userId });
        const sharedNotes = await Note.find({ sharedWith: userId });
        const notes = {
            "Notes created by  you": userNotes,
            "Notes shared with you": sharedNotes
        }
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getNoteById = async (req, res) => {
    try {
        const userId = req.userId;
        const noteId = req.params.id;

        const note = await Note.findOne({ _id: noteId, user: userId });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createNote = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, content } = req.body;

        const newNote = new Note({
            title,
            content,
            user: userId,
        });

        await newNote.save();

        res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateNote = async (req, res) => {
    try {
        const userId = req.userId;
        const noteId = req.params.id;
        const { title, content } = req.body;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, user: userId },
            { $set: { title, content } },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteNote = async (req, res) => {
    try {
        const userId = req.userId;
        const noteId = req.params.id;

        const deletedNote = await Note.findOneAndDelete({ _id: noteId, user: userId });

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Share a note with another user
const shareNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const sharedUsername = req.body.sharedUsername; // Username sent in the request body

        // Check if the note exists and the user is the creator
        const note = await Note.findOne({ _id: noteId, user: req.userId });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Fetch the user ID based on the provided username
        const sharedUser = await User.findOne({ username: sharedUsername });

        if (!sharedUser) {
            return res.status(404).json({ message: 'No such user exists.' });
        }

        // Check if the note is already shared with the user
        if (note.sharedWith.includes(sharedUser._id)) {
            return res.status(400).json({ message: 'Note is already shared with this user' });
        }

        // Share the note by adding the user ID to the sharedWith array
        note.sharedWith.push(sharedUser._id);
        await note.save();

        res.status(200).json({ message: 'Note shared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Search for notes based on keywords
const searchNotes = async (req, res) => {
    try {
        console.log('hello');
        const userId = req.userId;
        const query = req.query.q;

        // Use $text operator for text search on the 'title' and 'content' fields
        const results = await Note.find(
            { $and: [{ user: userId }, { $text: { $search: query } }] },
            { score: { $meta: 'textScore' } } // Optionally, you can sort by relevance score
        ).sort({ score: { $meta: 'textScore' } });

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, shareNote, searchNotes };
