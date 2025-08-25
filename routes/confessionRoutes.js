const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Confession = require('../models/Confession');

// Configure file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 🟢 Show all confessions
router.get('/', async (req, res) => {
    try {
        const confessions = await Confession.find().sort({ createdAt: -1 });
        res.render('confessions', { confessions });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🟢 Show form to submit a confession
router.get('/confess', (req, res) => {
    res.render('confess');
});

// 🟢 Handle new confession
router.post('/add', upload.single('media'), async (req, res) => {
    try {
        const confession = new Confession({
            story: req.body.story,
            media: req.file ? `/uploads/${req.file.filename}` : null
        });
        await confession.save();
        res.redirect('/confessions');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🟢 Add a reply to a confession
router.post('/:id/reply', async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);
        confession.replies.push({ text: req.body.text });
        await confession.save();
        res.redirect('/confessions');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 🟢 Edit a confession
router.post('/:id/edit', async (req, res) => {
    try {
        await Confession.findByIdAndUpdate(req.params.id, { story: req.body.story });
        res.redirect('/confessions');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error editing confession');
    }
});

// 🟢 Delete a confession
router.post('/:id/delete', async (req, res) => {
    try {
        await Confession.findByIdAndDelete(req.params.id);
        res.redirect('/confessions');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting confession');
    }
});

module.exports = router;
