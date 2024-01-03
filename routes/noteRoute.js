const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
} = require('../controllers/noteController');

const router = express.Router();


router.use(verifyToken);

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
