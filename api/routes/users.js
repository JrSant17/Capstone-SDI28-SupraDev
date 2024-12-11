/**
 * This file contains all http methods for the endpoint /users
 * Thus, the starting paths for all these router handlers of '/',
 * corresponds to /users
 */
const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: retrieves all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: gets a list of users
 */
router.get('/', (req, res) => {
  knex('user_table')
    .select('*')
    .then((user) => {
      res.status(200).send(user)
    })
    .catch(err => console.log(err))
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: gets a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *       404:
 *         description: User not found
 */
router.get('/:id', (req, res) => {
  knex('user_table')
    .select('*')
    .where({ id: req.params.id })
    .then((user) => {
      res.status(200).send(user)
    })
    .catch(err => console.log(err))
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: creates a new users
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal Server Error
 */
router.post('/', (req, res) => {
    const userFields = { first_name, lname, username,
        password, profile_pic, user_summary,
        email, p1_account, p1_auth,
        type, availability, experience,
        languages, operating_systems, avatar_url,
        time_available, is_supracoder, supradoubloons
        } = req.body;

        knex("user_table")
        .insert(userFields)
        .then(() => {
            res.status(201).send("User created successfully");
            console.log("User creation was successful");
        })
        .catch(err => {
            console.error("Error creating user:", err);
            res.status(500).send("Internal Server Error");
        });
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: updates a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', (req, res) => {
    const userFields = { first_name, lname, username,
        password, profile_pic, user_summary,
        email, p1_account, p1_auth,
        type, availability, experience,
        languages, operating_systems, avatar_url,
        time_available, is_supracoder, supradoubloons
      } = req.body;
    
      knex('user_table')
        .where({ id: req.params.id })
        .update(userFields)
        .then((updateCount) => {
          if (updateCount === 0) {
            res.status(404).send("User not found");
          } else {
            res.status(200).send("User updated successfully");
          }
        })
        .catch(err => {
          console.error("Error updating user:", err);
          res.status(500).send("Internal Server Error");
        });
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: deletes a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', (req, res) => {
    knex('user_table')
    .where({ id: req.params.id })
    .del()
    .then(res.status(204).send('user deleted'))
});

module.exports = router;