const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Port:', process.env.PORT);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the frontend folder
//app.use(express.static(path.join(__dirname, '../frontend')));

// Serve index.html for any unknown routes (Frontend SPA handling)
//app.get('*', (req, res) => {
 //   res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
//});

// MongoDB connection URI (from .env file)
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MongoDB URI is not defined. Please check your .env file.');
    process.exit(1);
}
const client = new MongoClient(uri);

let db;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('tankstellen');
        console.log('Connected to MongoDB...');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

// CRUD Operations

// Create
app.post('/streets', async (req, res) => {
    const { adresse, geometry } = req.body;
    try {
        const result = await db.collection('streets').insertOne({ adresse, geometry });
        res.send('Street added...');
    } catch (err) {
        console.error('Error creating street:', err);
        res.status(500).json({ message: 'Failed to create street', error: err.message });
    }
});

// Read
app.get('/streets', async (req, res) => {
    try {
        const streets = await db.collection('streets').find().toArray();
        res.json(streets);
    } catch (err) {
        console.error('Error fetching streets:', err);
        res.status(500).json({ message: 'Failed to fetch streets', error: err.message });
    }
});

// Update
app.put('/streets/:id', async (req, res) => {
    const { adresse, geometry } = req.body;
    const id = req.params.id;
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const result = await db.collection('streets').updateOne(
            { _id: new ObjectId(id) },
            { $set: { adresse, geometry } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Street not found' });
        }
        res.send('Street updated...');
    } catch (err) {
        console.error('Error updating street:', err);
        res.status(500).json({ message: 'Failed to update street', error: err.message });
    }
});

// Delete
app.delete('/streets/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const result = await db.collection('streets').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Street not found' });
        }
        res.send('Street deleted...');
    } catch (err) {
        console.error('Error deleting street:', err);
        res.status(500).json({ message: 'Failed to delete street', error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`Server running on port ${PORT}...`);
});