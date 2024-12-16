const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);
const bcrypt = require('bcrypt');

const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const knex = require('../../knex'); // Adjust the path to your Knex configuration
const router = express.Router();

/**
 * POST /login
 * This route handles user login by verifying credentials.
 */
router.post('/', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Validate input
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'Username/Email and password are required' });
  }

  try {
    // Check if the user exists in the database
    const user = await knex('user_table')
      .where('username', usernameOrEmail)
      .orWhere('email', usernameOrEmail)
      .first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or email' });
    }

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Return user information (exclude sensitive data)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login', error });
  }
});

module.exports = router;
