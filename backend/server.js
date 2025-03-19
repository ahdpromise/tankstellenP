const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('❌ MongoDB URI is not defined. Check your .env file.');
    process.exit(1);
}

const client = new MongoClient(uri);
let db;

async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('tankstellen');
        console.log('✅ Connected to MongoDB...');
        startServer();
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

function setupRoutes() {
    // Default route to fix "Cannot GET /"
    app.get('/', (req, res) => {
        res.send('Backend is running...');
    });

    // Get all streets
    app.get('/streets', async (req, res) => {
        try {
            const streets = await db.collection('streets').find().toArray();
            res.json(streets);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch streets', error: err.message });
        }
    });

    // Create a new street
    app.post('/streets', async (req, res) => {
        const { adresse, geometry } = req.body;
        try {
            await db.collection('streets').insertOne({ adresse, geometry });
            res.send('Street added...');
        } catch (err) {
            res.status(500).json({ message: 'Failed to create street', error: err.message });
        }
    });

    // Update a street
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
            res.status(500).json({ message: 'Failed to update street', error: err.message });
        }
    });

    // Delete a street
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
            res.status(500).json({ message: 'Failed to delete street', error: err.message });
        }
    });
}

function startServer() {
    setupRoutes();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}...`);
    });
}

connectToMongoDB();
