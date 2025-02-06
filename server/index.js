import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import MongoStore from "connect-mongo";

import initializePassport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import connectToDb from "./config/dbConfig.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    credentials: true, // Important: allows cookies & session sharing
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
  })
);
// Handle Preflight Requests
app.options("*", cors()); // Respond to preflight requests globally

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
initializePassport();

// Use authentication routes
app.use("/auth", authRoutes);

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await connectToDb(); // Connect to the DB
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();
