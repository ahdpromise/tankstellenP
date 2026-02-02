const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* ===============================
   MongoDB Connection
================================ */

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MongoDB URI is not defined. Check Render Environment Variables.');
    process.exit(1);
}

// ✅ FIX: TLS settings for MongoDB Atlas + Render
const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
});

let db;

async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('tankstellennew'); // ✅ correct DB name
        console.log('✅ Connected to MongoDB Atlas');
        startServer();
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

/* ===============================
   Routes
================================ */

function setupRoutes() {

    // Health check
    app.get('/', (req, res) => {
        res.send('🚀 Backend is running');
    });

    // GET all streets
    app.get('/streets', async (req, res) => {
        try {
            const streets = await db
                .collection('allstreets')   // ✅ correct collection
                .find()
                .toArray();

            res.json(streets);
        } catch (err) {
            res.status(500).json({
                message: 'Failed to fetch streets',
                error: err.message,
            });
        }
    });

    // CREATE street
    app.post('/streets', async (req, res) => {
        const { adresse, geometry } = req.body;

        try {
            await db.collection('allstreets').insertOne({
                adresse,
                geometry,
            });

            res.json({ message: 'Street added successfully' });
        } catch (err) {
            res.status(500).json({
                message: 'Failed to create street',
                error: err.message,
            });
        }
    });

    // UPDATE street
    app.put('/streets/:id', async (req, res) => {
        const { adresse, geometry } = req.body;
        const { id } = req.params;

        try {
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID' });
            }

            const result = await db.collection('allstreets').updateOne(
                { _id: new ObjectId(id) },
                { $set: { adresse, geometry } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Street not found' });
            }

            res.json({ message: 'Street updated successfully' });
        } catch (err) {
            res.status(500).json({
                message: 'Failed to update street',
                error: err.message,
            });
        }
    });

    // DELETE street
    app.delete('/streets/:id', async (req, res) => {
        const { id } = req.params;

        try {
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID' });
            }

            const result = await db
                .collection('allstreets')
                .deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Street not found' });
            }

            res.json({ message: 'Street deleted successfully' });
        } catch (err) {
            res.status(500).json({
                message: 'Failed to delete street',
                error: err.message,
            });
        }
    });
}

/* ===============================
   Server
================================ */

function startServer() {
    setupRoutes();

    const PORT = process.env.PORT || 5000; // ✅ Render uses PORT
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

connectToMongoDB();
