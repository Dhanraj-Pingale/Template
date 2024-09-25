import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json()); // To handle JSON bodies
app.use(cors()); // Enable CORS for cross-origin requests

const uri = process.env.MONGO_URI; // Use environment variable for MongoDB URI

// Function to list all databases (useful for testing connection)
async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

// Main function to handle MongoDB connection
async function main() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB");

    // List databases to verify the connection (can be removed in production)
    await listDatabases(client);

    const usersCollection = client.db("Test").collection("users");

    // Register user route
    app.post("/registerdb", async (req, res) => {
      const { name, email, password } = req.body;

      // Ensure all fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      try {
        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
        }

        // Insert new user into the "users" collection
        const result = await usersCollection.insertOne({ name, email, password });
        res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Login user route
    app.post("/logindb", async (req, res) => {
      const { email, password } = req.body;

      // Ensure both fields are provided
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      try {
        // Find the user in the "users" collection
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).json("No user found");
        }

        // Check if the password matches
        if (user.password === password) {
          return res.json("Success");
        } else {
          return res.status(401).json("Incorrect Password");
        }
      } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // If you plan to keep the connection open, don't close the client here.
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  }
}

// Start the server and connect to MongoDB
app.listen(3000, async () => {
  console.log("Server is running on port 3000");
  await main(); // Call the main function to connect to MongoDB
});
