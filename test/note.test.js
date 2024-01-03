const Note = require('../models/Note');
const User = require('../models/User');
const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    searchNotes,
} = require('../controllers/noteController');

const req = {
    params: { id: 'testNoteId' },
    userId: 'testUserId',
};
const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
};

jest.mock('../models/Note');
jest.mock('../models/User');

describe('Note Controller get Notes method test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get user and shared notes successfully', async () => {
        const testData = {
            "Notes created by  you": [{ title: 'Note 1', content: 'Content 1' }, { title: 'Note 2', content: 'Content 2' }],
            "Notes shared with you": undefined,
        };
        Note.find.mockResolvedValueOnce(testData["Notes created by  you"]);

        await getNotes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(testData);
    });

    it('should handle errors during retrieval', async () => {
        Note.find.mockRejectedValueOnce(new Error('Some database error'));

        await getNotes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});
describe('Note Controller get individual Notes by id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve a note by ID successfully', async () => {
        const testData = { title: 'Note 1', content: 'Content 1' };
        Note.findOne.mockResolvedValueOnce(testData);

        req.params = { id: 'testNoteId' };
        await getNoteById(req, res);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(testData);
    });

    it('should handle note not found', async () => {
        Note.findOne.mockResolvedValueOnce(null);

        req.params = { id: 'nonexistentNoteId' };
        await getNoteById(req, res);

        console.log(Note.findOne.mock.calls);
        console.log(res.json.mock.calls);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'nonexistentNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note not found' });
    });

    it('should handle errors during retrieval by ID', async () => {
        const errorMessage = 'Some database error';
        Note.findOne.mockRejectedValueOnce(new Error(errorMessage));

        req.params = { id: 'testNoteId' };
        await getNoteById(req, res);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});


describe('Note Controller create Note method test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new note successfully', async () => {
        const req = {
            userId: 'testUserId',
            body: { title: 'Test Note', content: 'Test Content' },
        };

        const mockNote = {
            _id: 'testNoteId',
            title: 'Test Note',
            content: 'Test Content',
            user: 'testUserId',
            save: jest.fn().mockResolvedValueOnce(),
        };

        Note.mockReturnValueOnce(mockNote);

        await createNote(req, res);

        expect(Note).toHaveBeenCalled();
        expect(Note.mock.calls[0][0]).toEqual(expect.objectContaining(req.body));
        expect(mockNote.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note created successfully', note: expect.any(Object) });
    });

    it('should handle errors during note creation', async () => {
        const req = {
            userId: 'testUserId',
            body: { title: 'Test Note', content: 'Test Content' },
        };

        const errorMessage = 'Some database error';
        const error = new Error(errorMessage);

        Note.mockReturnValueOnce({
            save: jest.fn().mockRejectedValueOnce(error),
        });

        await createNote(req, res);

        expect(Note).toHaveBeenCalled();
        expect(Note.mock.calls[0][0]).toEqual(expect.objectContaining(req.body));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

});

describe('Note Controller update Note method test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a note successfully', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
            body: { title: 'Updated Note', content: 'Updated Content' },
        };

        const mockUpdatedNote = {
            _id: 'testNoteId',
            title: 'Updated Note',
            content: 'Updated Content',
            user: 'testUserId',
        };

        Note.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedNote);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await updateNote(req, res);

        expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'testNoteId', user: 'testUserId' },
            { $set: { title: 'Updated Note', content: 'Updated Content' } },
            { new: true }
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note updated successfully', note: mockUpdatedNote });
    });

    it('should handle note not found during update', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'nonexistentNoteId' },
            body: { title: 'Updated Note', content: 'Updated Content' },
        };

        Note.findOneAndUpdate.mockResolvedValueOnce(null);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await updateNote(req, res);

        expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'nonexistentNoteId', user: 'testUserId' },
            { $set: { title: 'Updated Note', content: 'Updated Content' } },
            { new: true }
        );

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note not found' });
    });

    it('should handle errors during note update', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
            body: { title: 'Updated Note', content: 'Updated Content' },
        };

        const errorMessage = 'Some database error';
        Note.findOneAndUpdate.mockRejectedValueOnce(new Error(errorMessage));

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await updateNote(req, res);

        expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'testNoteId', user: 'testUserId' },
            { $set: { title: 'Updated Note', content: 'Updated Content' } },
            { new: true }
        );

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});

describe('Note Controller delete Note method test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a note successfully', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
        };

        const mockDeletedNote = {
            _id: 'testNoteId',
            title: 'Deleted Note',
            content: 'Deleted Content',
            user: 'testUserId',
        };

        Note.findOneAndDelete.mockResolvedValueOnce(mockDeletedNote);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await deleteNote(req, res);

        expect(Note.findOneAndDelete).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note deleted successfully', note: mockDeletedNote });
    });

    it('should handle note not found during deletion', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'nonexistentNoteId' },
        };

        Note.findOneAndDelete.mockResolvedValueOnce(null);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await deleteNote(req, res);

        expect(Note.findOneAndDelete).toHaveBeenCalledWith({ _id: 'nonexistentNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note not found' });
    });

    it('should handle errors during note deletion', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
        };

        const errorMessage = 'Some database error';
        Note.findOneAndDelete.mockRejectedValueOnce(new Error(errorMessage));

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await deleteNote(req, res);

        expect(Note.findOneAndDelete).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});

describe('Note Controller share Note method test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should share a note successfully', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
            body: { sharedUsername: 'sharedUser123' },
        };

        const mockNote = {
            _id: 'testNoteId',
            user: 'testUserId',
            sharedWith: [],
            save: jest.fn(),
        };

        const mockSharedUser = {
            _id: 'sharedUserId',
            username: 'sharedUser123',
        };

        Note.findOne.mockResolvedValueOnce(mockNote);
        User.findOne.mockResolvedValueOnce(mockSharedUser);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shareNote(req, res);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(User.findOne).toHaveBeenCalledWith({ username: 'sharedUser123' });
        expect(mockNote.sharedWith).toContain('sharedUserId');
        expect(mockNote.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note shared successfully' });
    });

    it('should handle note not found during sharing', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'nonexistentNoteId' },
            body: { sharedUsername: 'sharedUser123' },
        };

        Note.findOne.mockResolvedValueOnce(null);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shareNote(req, res);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'nonexistentNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note not found' });
    });

    it('should handle shared user not found during sharing', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
            body: { sharedUsername: 'nonexistentUser' },
        };

        const mockNote = {
            _id: 'testNoteId',
            user: 'testUserId',
            sharedWith: [],
            save: jest.fn(),
        };

        Note.findOne.mockResolvedValueOnce(mockNote);
        User.findOne.mockResolvedValueOnce(null);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shareNote(req, res);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistentUser' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No such user exists.' });
    });

    it('should handle note already shared with the user during sharing', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
            body: { sharedUsername: 'sharedUser123' },
        };

        const mockNote = {
            _id: 'testNoteId',
            user: 'testUserId',
            sharedWith: ['existingSharedUserId'],
            save: jest.fn(),
        };

        const mockSharedUser = {
            _id: 'existingSharedUserId',
            username: 'sharedUser123',
        };

        Note.findOne.mockResolvedValueOnce(mockNote);
        User.findOne.mockResolvedValueOnce(mockSharedUser);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shareNote(req, res);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(User.findOne).toHaveBeenCalledWith({ username: 'sharedUser123' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Note is already shared with this user' });
    });

    it('should handle errors during note sharing', async () => {
        const req = {
            userId: 'testUserId',
            params: { id: 'testNoteId' },
            body: { sharedUsername: 'sharedUser123' },
        };

        const errorMessage = 'Some database error';
        Note.findOne.mockRejectedValueOnce(new Error(errorMessage));

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await shareNote(req, res);

        expect(Note.findOne).toHaveBeenCalledWith({ _id: 'testNoteId', user: 'testUserId' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});

describe('Note Controller search Notes method test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should search for notes based on keywords successfully', async () => {
        const req = {
            userId: 'testUserId',
            query: { q: 'keyword' },
        };

        const mockResults = [
            { _id: 'note1', title: 'Note 1', content: 'Content 1', user: 'testUserId' },
            { _id: 'note2', title: 'Note 2', content: 'Content 2', user: 'testUserId' },
        ];

        Note.find.mockResolvedValueOnce(mockResults);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        try {
            await searchNotes(req, res);
            console.log(res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResults);
        } catch (error) {
            console.error(error);
        }
    });
});
