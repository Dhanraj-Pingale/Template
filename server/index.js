import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import MongoStore from "connect-mongo";

import initializePassport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectToDb from "./config/dbConfig.js";

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.options("*", cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===== Initialize Passport =====
initializePassport();

// ===== Routes =====
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// ===== Start Server =====
async function startServer() {
  try {
    await connectToDb();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();