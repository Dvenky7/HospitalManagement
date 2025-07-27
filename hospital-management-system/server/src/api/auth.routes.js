const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// This line defines the POST /register endpoint and links it to the register function
router.post('/register', authController.register);

// We will also add the login route now for the next step
router.post('/login', authController.login);

module.exports = router;
