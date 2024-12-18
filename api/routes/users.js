/**
 * This file contains all http methods for the endpoint /users
 * Thus, the starting paths for all these router handlers of '/',
 * corresponds to /users
 */
const express = require('express');
const router = express.Router();
const userFields = [
  'id',
  'first_name',
  'last_name',
  'username',
  'email',
  'job_title',
  'p1_account',
  'p1_auth',
  'type',
  'password',
  'availability',
  'experience',
  'languages',
  'operating_systems',
  'avatar_url',
  'profile_pic',
  'user_summary',
  'time_available',
  'is_supracoder',
  'supradoubloons'
];
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);
const bcrypt = require('bcrypt');

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
  let params = req.query;
  console.log(`request for ${req.path} with params: ${JSON.stringify(params)}`);


  if (Object.keys(params).length === 0) {
    //normal request for ALL users with no parameter fields
    knex('user_table')
    .select('*')
    .then((user) => {
      if (!user) {
        return res.status(404).send("No Users found!");
      }
      res.status(200).send(user)
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal server error");
    });
  } else{
    //request for specific users with specified field parameters.
    _getUserQueryEntries(res, params);
  }
});

/**
 * Async handles the advanced query for users
 * @param {*} res the response to send back
 * @param {*} params the query parameters provided by the user
 * @returns res
 */
async function _getUserQueryEntries(res, params) {
  //build out the knex query for fields provided by user
  let query = knex('user_table').select("*");
  userFields.forEach(field => {
    console.log(`process field ${field}`)
    if (params[field]) {
      if (field == 'type' || field == 'time_available') {
        query = query.where(field, '=', parseInt(params[field]));
      } else if (field == 'is_supracoder') {
        query = query.where(field, '=', Boolean(params[field]));
      } else {
        query = query.where(field, 'LIKE', `%${params[field]}%`);
      }
    }
  });

  console.log(`built final query: ${query}`)
  const result = await query;
  console.log(`final result ${JSON.stringify(result)}`)
  if(!result){
    return res.status(404).send("No Users found!");
  }
  return res.status(200).send(result);
};

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
    .first()
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(user)
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal server error");
    });
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
router.post('/', async (req, res) => {
  const {
    first_name, last_name, username,
    password, profile_pic, user_summary,
    job_title, email, p1_account, p1_auth,
    type, availability, experience,
    languages, operating_systems, avatar_url,
    time_available, is_supracoder, supradoubloons,
    command
  } = req.body;

  try {
    // Map role types to integers (handling both string and integer inputs)
    let roleType;
    if (!type || type === "normal" || type === 3) {
      roleType = 3; // Default to "normal" role
    } else if (type === "leadership" || type === 2) {
      roleType = 0; // Pending approval for leadership
    } else if (type === "supracoder" || type === 1) {
      roleType = 0; // Pending approval for supracoder
    } else if (type === "admin" || type === 4) {
      roleType = 0; // Pending approval for admin
    } else {
      return res.status(400).json({ message: "Invalid role type provided." });
    }

    console.log(`Calculated roleType: ${roleType} for user type: ${type}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const userFields = {
      first_name,
      last_name,
      username,
      password: hashedPassword,
      profile_pic,
      user_summary,
      job_title,
      email,
      p1_account,
      p1_auth,
      type: roleType, // Use the calculated role type
      availability,
      experience,
      languages,
      operating_systems,
      avatar_url,
      time_available,
      is_supracoder: roleType === 1, // Set true only for supracoder
      supradoubloons,
      command
    };

    console.log(`Creating user with fields: ${JSON.stringify(userFields)}`);
    await knex("user_table").insert(userFields);

    if (roleType === 1) {
      return res.status(201).send("Account created successfully. Your role is pending admin approval.");
    }
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    if (err.code === '23505') {
      res.status(409).json({
        error: `${err.detail}`,
        username: userFields.username,
        email: userFields.email
      });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
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
  const userFields = req.body;

  knex('user_table')
    .where({ id: req.params.id })
    .update(userFields)
    .then((updateCount) => {
      if (updateCount === 0) {
        res.status(404).send("User not found");
      }
      return knex('user_table')
        .select('*')
        .where({ id: req.params.id })
        .first();
    })
    .then((updatedUser) => {
      if (updatedUser) {
        const {...userWithoutPassword } = updatedUser;
        return res.status(200).json(userWithoutPassword);
      }
    })
    .catch(err => {
      console.error("Error updating user:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.patch('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!['supracoder', 'leadership', 'admin'].includes(type)) {
      return res.status(400).send("Invalid role type for approval");
    }

    const updatedRows = await knex('user_table')
    .where({ id, type: 1 })
    .andWhere({ type: 1 }) //user is pending approval
    .update({
      type: type === 'supracoder' ? 3 : type === 'leadership' ? 2 : 4,
      is_supracoder: type === 'supracoder',
    });

  if (!updatedRows) {
    return res.status(404).json({ error: "User not found or not pending approval" });
  }

  res.status(200).json({ message: "User role approved successfully" });
} catch (error) {
  console.error("Error approving user:", error);
  res.status(500).json({ error: "Internal server error" });
}
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
    console.log(`user delete success for ${req.params.id}`)
});

module.exports = router;