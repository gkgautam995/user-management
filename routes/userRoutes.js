// Import the express module and the userController
const express = require('express');
const userController = require('../controllers/userController');

// Create a new router object
const router = express.Router();

// Route to render the registration page
router.get('/register', (req, res) => {
  res.render('user/register');
});

// Route to handle user registration
router.post(
  '/register',
  userController.uploadUserPhoto, // Middleware to handle photo upload
  userController.resizeUserPhoto, // Middleware to resize the uploaded photo
  userController.register // Controller to register the user
);

// Route to render the login page
router.get('/login', (req, res) => {
  res.render('user/login');
});

// Route to render the forgot password page
router.get('/forgotPassword', (req, res) => {
  res.render('user/forgotPassword');
});

// Route to render the forgot password page
router.get('/resetPassword/:token', (req, res) => {
  const { token } = req.params;
  res.render('user/resetPassword', { token });
});

// Route to handle user login
router.post('/login', userController.login);

// Route to handle user logout
router.get('/logout', userController.logout);

// Route to render the index page, protected by authentication middleware
router.get('/index', userController.protect, (req, res) => {
  res.render('user/index', { user: req.user }); // Pass the authenticated user to the template
});

// Route to handle forgot password (requesting password reset link)
router.post('/forgotPassword', userController.forgotPassword);

// Route to handle password reset using the token
router.patch('/resetPassword/:token', userController.resetPassword);

// Export the router to be used in other parts of the application
module.exports = router;
