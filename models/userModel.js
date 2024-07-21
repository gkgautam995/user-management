// Import necessary modules
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Define the User model with fields and their constraints
const User = sequelize.define(
  'User',
  {
    // Define the 'name' field with string type, not allowing null values, and length validation
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50], // Name length must be between 1 and 50 characters
      },
    },
    // Define the 'email' field with string type, not allowing null values, ensuring uniqueness, and email validation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email must be unique
      validate: {
        isEmail: true, // Validate as email format
      },
    },
    // Define the 'photo' field with string type
    photo: {
      type: DataTypes.STRING,
    },
    // Define the 'role' field with ENUM type, defaulting to 'user'
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user', // Default role is 'user'
    },
    // Define the 'password' field with string type, not allowing null values, and length validation
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 128], // Password length must be between 8 and 128 characters
      },
    },
    // Define the 'active' field with boolean type, defaulting to true
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Default value is true (active user)
    },
    // Field to store the password reset token
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    // Field to store the expiration time of the password reset token
    passwordResetExpires: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true, // Enable timestamps for createdAt and updatedAt fields
  }
);

// Hook to hash the password before saving the user
User.beforeSave(async (user) => {
  // Check if the password field has changed
  if (user.changed('password')) {
    // Hash the password with bcrypt and a salt round of 12
    user.password = await bcrypt.hash(user.password, 12);
  }
});

// Method to generate a password reset token
User.prototype.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 12 * 60 * 60 * 1000; // Token valid for 12 hours

  return resetToken;
};

// Export the User model
module.exports = User;
