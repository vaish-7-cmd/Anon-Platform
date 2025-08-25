const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Question = require('../models/Question');
const Confession = require('../models/Confession'); // 🟢 added this line

// Configure file storage for uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // save to uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 🟢 Render all questions + confessions page
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        const confessions = await Confession.find().sort({ createdAt: -1 }); // 🟢 added this
        res.render('questions', { questions, confessions }); // 🟢 pass both
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🟢 Show "Ask a Question" form
router.get('/ask', (req, res) => {
    res.render('ask-question');
});

// 🟢 Handle form submission with file upload
router.post('/ask', upload.single('media'), async (req, res) => {
    try {
        const question = new Question({
            text: req.body.text,
            media: req.file ? `/uploads/${req.file.filename}` : null
        });
        await question.save();
        res.redirect('/questions'); // redirect back to list after submit
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🟢 Add a reply
router.post('/:id/reply', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        question.replies.push({ text: req.body.text });
        await question.save();
        res.redirect('/questions'); // redirect so reply shows up in UI
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🟢 Edit a question
router.post('/:id/edit', async (req, res) => {
    try {
        await Question.findByIdAndUpdate(req.params.id, {
            text: req.body.text
        });
        res.redirect('/questions');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🟢 Delete a question
router.post('/:id/delete', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.redirect('/questions');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
