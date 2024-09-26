import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";

dotenv.config();

const app = express();
app.use(express.json()); // To handle JSON bodies
app.use(cors()); // Enable CORS for cross-origin requests

const uri = process.env.MONGO_URI; // Use environment variable for MongoDB URI

// Setup express-session with 1 day expiry (24 hours)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", // Use an environment variable for session secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session expires in 1 day
      httpOnly: true, // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection and Passport configuration
async function main() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB");

    const usersCollection = client.db("Test").collection("users");

    // Passport Local Strategy
    passport.use(
      new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
          try {
            const user = await usersCollection.findOne({ email });

            if (!user) {
              console.log("User not found");
              return done(null, false, { message: "Incorrect email." });
            }

            // Compare the password using bcrypt
            const isValidPassword = await bcrypt.compare(
              password,
              user.password
            );

            if (!isValidPassword) {
              console.log("Password does not match");
              return done(null, false, { message: "Incorrect password." });
            }

            console.log("Login successful");
            return done(null, user);
          } catch (error) {
            console.error("Error during login:", error);
            return done(error);
          }
        }
      )
    );

    // Serialize and deserialize user for session support
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await usersCollection.findOne({
          _id: new MongoClient.ObjectId(id),
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    });

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

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the "users" collection
        const result = await usersCollection.insertOne({
          name,
          email,
          password: hashedPassword,
        });
        res
          .status(201)
          .json({
            message: "User registered successfully",
            userId: result.insertedId,
          });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Login route with Passport authentication
    app.post("/logindb", passport.authenticate("local"), (req, res) => {
      res.json({
        message: "Logged in successfully",
        user: {
          email: req.user.email,
          name: req.user.name,
        },
      });
    });

    // Logout route
    app.post("/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ message: "Logged out successfully" });
      });
    });
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  }
}

// Start the server and connect to MongoDB
app.listen(3000, async () => {
  console.log("Server is running on port 3000");
  await main(); // Call the main function to connect to MongoDB
});
