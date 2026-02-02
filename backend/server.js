const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 🔐 MongoDB URI من Render Environment
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('❌ MongoDB URI is not defined. Check Render Environment Variables.');
    process.exit(1);
}

// ✅ إعداد MongoDB الرسمي المتوافق مع Atlas
const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
});

let db;

// 🔗 الاتصال بقاعدة البيانات
async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('tankstellennew'); // اسم القاعدة على Atlas
        console.log('✅ Connected to MongoDB Atlas');
        startServer();
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

// 🛣️ Routes
function setupRoutes() {
    // Root
    app.get('/', (req, res) => {
        res.send('Backend is running...');
    });

    // GET all streets
    app.get('/streets', async (req, res) => {
        try {
            const streets = await db.collection('streets').find().toArray();
            res.json(streets);
        } catch (err) {
            res.status(500).json({
                message: 'Failed to fetch streets',
                error: err.message,
            });
        }
    });

    // POST new street
    app.post('/streets', async (req, res) => {
        const { adresse, geometry } = req.body;
        try {
            await db.collection('streets').insertOne({ adresse, geometry });
            res.status(201).json({ message: 'Street added successfully' });
        } catch (err) {
            res.status(500).json({
                message: 'Failed to create street',
                error: err.message,
            });
        }
    });

    // PUT update street
    app.put('/streets/:id', async (req, res) => {
        const { adresse, geometry } = req.body;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        try {
            const result = await db.collection('streets').updateOne(
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

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        try {
            const result = await db.collection('streets').deleteOne({
                _id: new ObjectId(id),
            });

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

// 🚀 تشغيل السيرفر (Render يمرر PORT تلقائي)
function startServer() {
    setupRoutes();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// ▶️ Start
connectToMongoDB();
