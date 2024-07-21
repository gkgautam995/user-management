// Import required modules
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { promisify } = require('util');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Set file filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error('Not an image! Please upload only images.'), false); // Reject non-image files
  }
};

// Configure multer upload settings
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Set file size limit to 5MB
});

// Middleware to handle single file upload
exports.uploadUserPhoto = upload.single('photo');

// Middleware to resize uploaded user photos
exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next(); // If no file is uploaded, skip to the next middleware

  // Create a unique filename for the uploaded photo
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Resize the image, convert it to JPEG, and save it to the specified path
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(__dirname, '../public/uploads', req.file.filename));

  req.body.photo = req.file.filename; // Save the filename in the request body
  next();
};

// Controller to handle user registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .render('user/register', { message: 'Passwords do not match' });
    }

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password,
      photo: req.body.photo,
    });

    // Redirect to login page after successful registration
    res.redirect('/login');
  } catch (err) {
    // Handle errors and render the registration page with an error message
    res.status(400).render('user/register', { message: err.message });
  }
};

// Controller to handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .render('user/login', { message: 'Incorrect email or password' });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set the JWT as a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: process.env.JWT_EXPIRES_IN,
    });

    // Redirect to the index page after successful login
    res.redirect('/index');
  } catch (err) {
    // Handle errors and render the login page with an error message
    res.status(400).render('user/login', { message: err.message });
  }
};

// Send password reset link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('No user with that email');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/resetPassword/${resetToken}`;

    // Here you would send the email with the resetURL
    // For simplicity, we are returning the reset URL in the response
    res.status(200).send(`Password reset link: ${resetURL}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).send('Token is invalid or has expired');
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    // Redirect to login page after successful reset password
    res.redirect('/login');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller to handle user logout
exports.logout = (req, res) => {
  // Set a cookie with a short expiration time to log the user out
  res.cookie('jwt', 'loggedout', { maxAge: 1 });

  // Redirect to the login page after logout
  res.redirect('/login');
};

// Middleware to protect routes and ensure the user is authenticated
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt; // Get the JWT from the cookies
    }

    if (!token) {
      return res.status(401).redirect('/login'); // Redirect to login if no token is found
    }

    // Verify the JWT
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).redirect('/login'); // Redirect to login if user is not found
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(401).redirect('/login'); // Redirect to login if an error occurs
  }
};
