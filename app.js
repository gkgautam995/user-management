// Import necessary modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Load environment variables from .env file
dotenv.config();

// Create an instance of an Express application
const app = express();

// Set the view engine to Pug
app.set("view engine", "pug");
// Set the directory for views
app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));
// Middleware to parse cookies
app.use(cookieParser());
// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Use user routes for the root URL
app.use("/", userRoutes);

// Get the port number from environment variables or use 3000 as default
const PORT = process.env.PORT || 3000;

// Sync the Sequelize models with the database and start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
