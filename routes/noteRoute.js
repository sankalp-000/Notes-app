// routes/noteRoutes.js

const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    searchNotes, // Include the new searchNotes function
} = require('../controllers/noteController');

const router = express.Router();

router.use(verifyToken);
// Correct endpoint for searching notes
router.get('/search', searchNotes);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// New endpoint to share a note
router.post('/share/:id', shareNote);


module.exports = router;
