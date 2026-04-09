// To run this file:
// 1. Ensure you have the required packages: npm install mongodb dotenv
// 2. Run the file: node mongodbPing.js

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

async function testConnection() {
  // Read connection string from environment variables, fallback is provided as an example format
  // Note: We check both MONGODB_URI and MONGO_URI simply to align with common conventions
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ ERROR: Missing connection string.");
    console.error("Please provide a valid MONGODB_URI or MONGO_URI in your .env file.");
    process.exit(1);
  }

  console.log("⏳ Initializing MongoDB Client...");
  
  // Set the Stable API version to strictly match the Atlas recommended driver options
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Attempt to establish network connections
    console.log("🔌 Connecting to MongoDB Atlas...");
    await client.connect();

    // Verify connectivity by sending a lightweight admin 'ping' operation against the server
    console.log("📡 Sending ping to cluster...");
    await client.db("admin").command({ ping: 1 });
    
    // If the ping succeeds without exceptions, network access is confirmed
    console.log("✅ SUCCESS: Successfully connected to MongoDB and pinged your deployment!");
  } catch (error) {
    // If connection errors occur, commonly hints at IP Whitelisting or bad credentials.
    console.error("❌ FAILURE: Unable to connect or ping MongoDB.");
    console.error("Error details:", error.message);
  } finally {
    // Always release the connection pools to clean up memory
    console.log("🔒 Closing the database connection.");
    await client.close();
  }
}

testConnection();
