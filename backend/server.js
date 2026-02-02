const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('❌ MongoDB URI is not defined');
    process.exit(1);
}

const client = new MongoClient(uri);
let db;

async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('tankstellennew');
        console.log('✅ Connected to MongoDB Atlas');
        startServer();
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
}

function setupRoutes() {

    app.get('/', (req, res) => {
        res.send('Backend is running ✅');
    });

    // ✅ GET
    app.get('/streets', async (req, res) => {
        try {
            const data = await db.collection('allstreets').find().toArray();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ✅ POST
    app.post('/streets', async (req, res) => {
        try {
            await db.collection('allstreets').insertOne(req.body);
            res.status(201).json({ message: 'Street added' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ✅ PUT
    app.put('/streets/:id', async (req, res) => {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        try {
            await db.collection('allstreets').updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );
            res.json({ message: 'Street updated' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ✅ DELETE
    app.delete('/streets/:id', async (req, res) => {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        try {
            await db.collection('allstreets').deleteOne({ _id: new ObjectId(id) });
            res.json({ message: 'Street deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}

function startServer() {
    setupRoutes();
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

connectToMongoDB();
