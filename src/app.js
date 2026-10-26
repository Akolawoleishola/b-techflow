const express = require("express");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

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

app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON. Please check your request body.",
    });
  }

  return errorHandler(err, req, res, next);
});

module.exports = app;