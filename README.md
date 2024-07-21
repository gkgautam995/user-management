# User Management Web Application

## Introduction

This User Management project is a comprehensive web application that handles essential user-related functionalities such as registration, login, logout, password recovery, and profile management. The backend is built using Node.js and Express.js, ensuring a robust and scalable server-side application.

## Features

- **User Registration**: New users can register with their name, email, password, and profile picture.
- **Data Validation**: User inputs are validated to maintain data integrity and security.
- **User Login and Logout**: Secure login and logout mechanisms are implemented, with password hashing for added security.
- **Password Management**: Users can reset their passwords using a JWT-based reset link, which is valid for a limited time.
- **Profile Picture Storage**: Users can upload and update their profile pictures, which are compressed and stored efficiently.
- **Database**: MySQL is used for storing user information, ensuring data persistence and reliability.
- **Frontend**: Pug is utilized for creating dynamic views, and SCSS for styling, offering a clean and responsive user interface.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Templating Engine**: Pug
- **Styling**: SCSS
- **ORM**: Sequelize
- **Authentication**: JWT
- **Image Processing**: Sharp

## Project Structure

```plaintext
.
├── config
│   └── db.js          # Database configuration
├── controllers
│   └── userController.js
├── models
│   └── userModel.js   # User model
├── public
│   ├── css
│   │   └── main.css
│   ├── image
│   │   └── nat-10.jpg
│   └── js
├── routes
│   └── userRoutes.js  # Routes for user operations
├── sass
│   ├── abstracts
│   │   └── _variables.scss
│   ├── base
│   │   ├── _animations.scss
│   │   ├── _base.scss
│   │   ├── _typography.scss
│   │   └── _utilities.scss
│   ├── components
│   │   ├── _button.scss
│   │   └── _form.scss
│   ├── layout
│   ├── pages
│   │   └── _home.scss
│   ├── themes
│   ├── vendors
│   └── main.scss
├── utils
├── views
│   ├── layouts
│   │   └── main.pug
│   ├── partials
│   │   └── header.pug
│   ├── user
│   │   ├── register.pug
│   │   ├── login.pug
│   │   ├── forgotPassword.pug
│   │   ├── resetPassword.pug
│   │   └── index.pug
├── app.js             # Main application file
├── package.json
└── README.md
```
