const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
const mongoURI =
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017" // Use test DB URI
    : process.env.MONGO_URI;

mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes
const authRoutes = require("./Routes/authRoutes.js");
const blogRoutes = require("./Routes/blogRoute.js");

console.log("authRoutes loaded successfully:", authRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

module.exports = app;
