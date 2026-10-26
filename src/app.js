const express = require("express");

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Basic welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "B-Techflow API is running.",
  });
});

module.exports = app;