const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
try {

mongoose.connect('mongodb+srv://foziljonsodiq:2w1N7TUeptKLhvWq@cluster0.ehqwhfo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    dbName: 'trello-clone',
    useNewUrlParser: true,
    useUnifiedTopology: true
});
console.log('Connected to MongoDB');


} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}

// Card Schema
const cardSchema = new mongoose.Schema({
    title: String,
    description: String,
    list: String,
    order: Number
});

const Card = mongoose.model('Card', cardSchema);

// API Routes
app.get('/api/cards', async (req, res) => {
    try {
        const cards = await Card.find().sort('order');
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cards' });
    }
});

app.post('/api/cards', async (req, res) => {
    try {
        const card = new Card(req.body);
        await card.save();
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Error creating card' });
    }
});

app.put('/api/cards/:id', async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Error updating card' });
    }
});

app.delete('/api/cards/:id', async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params.id);
        res.json({ message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting card' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
