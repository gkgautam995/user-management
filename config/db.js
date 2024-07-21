// Importing the necessary modules: Sequelize for database management and dotenv for environment variable management
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Load environment variables from the .env file
dotenv.config();

// Create a new Sequelize instance to connect to the MySQL database using credentials and details from environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: "mysql", // The dialect of the database, in this case, MySQL
  }
);

// Authenticate and connect to the database
sequelize
  .authenticate()
  .then(() => console.log("Database connected...")) // If the connection is successful, log "Database connected..."
  .catch((err) => console.log("Error: " + err)); // If there is an error, log the error message

// Export the sequelize instance to use it in other parts of the application
module.exports = sequelize;
