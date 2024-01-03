const Note = require('../models/Note');

const getNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const notes = await Note.find({ user: userId });
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

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };
