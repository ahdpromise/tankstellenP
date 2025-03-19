const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables

// MongoDB connection URI from .env file
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MongoDB URI is not defined. Please check your .env file.');
    process.exit(1);
}

const client = new MongoClient(uri);

// JSON data
const jsonData = {
    "features": [
        {
            "attributes": {
                "objectid": 98,
                "adresse": "Bonner Str. 98 (50677 Neustadt/Süd)"
            },
            "geometry": {
                "x": 6.960644911005172,
                "y": 50.916095041454554
            }
        },
        {
            "attributes": {
                "objectid": 99,
                "adresse": "Hülchrather Str. 17 (50670 Neustadt/Nord)"
            },
            "geometry": {
                "x": 6.9610691756320628,
                "y": 50.954466539174284
            }
        }

        
        // Add more streets here as needed
    ]
};

// Function to insert data into MongoDB
async function insertData() {
    try {
        await client.connect();
        const db = client.db('tankstellen'); // Ensure this matches your database name
        const collection = db.collection('streets');

        // Transform JSON data
        const transformedData = jsonData.features.map(feature => ({
            adresse: feature.attributes.adresse,
            geometry: {
                x: feature.geometry.x,
                y: feature.geometry.y
            }
        }));

        // Insert into MongoDB
        const result = await collection.insertMany(transformedData);
        console.log(`${result.insertedCount} streets inserted successfully.`);
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        await client.close();
    }
}

// Run the function
insertData();
