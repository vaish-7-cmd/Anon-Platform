const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// ✅ Import models
const Question = require('./models/Question');
const Confession = require('./models/Confession');

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads')); // serve media files
app.set('view engine', 'ejs');

// MongoDB Connection (mongod only, no mongosh)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB via mongod'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
// app.get('/', (req, res) => {
//     res.send('Anonymous Q&A + Confessions API running');
// });

// Import routes (already created in routes/)
const questionRoutes = require('./routes/questionRoutes');
const confessionRoutes = require('./routes/confessionRoutes');
app.use('/questions', questionRoutes);
app.use('/confessions', confessionRoutes);

// Home
// Home page (show latest questions + confessions)
app.get('/', async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 }).limit(5);
        const confessions = await Confession.find().sort({ createdAt: -1 }).limit(5);

        res.render('index', { questions, confessions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Questions page
app.get('/questions', async (req, res) => {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.render('questions', { questions });
});

// Confessions page
app.get('/confessions', async (req, res) => {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.render('confessions', { confessions });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
