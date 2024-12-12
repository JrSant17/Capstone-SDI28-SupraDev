/**
 * This file contains all http methods for the endpoint /projects
 * Thus, the starting paths for all these router handlers of '/',
 * corresponds to /projects
 */
const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: retrieves all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: a list of projects
 *       500:
 *         description: Internal Server Error
 */
router.get('/', (req, res) => {
  knex('project_table')
    .select('*')
    .then((project) => {
      res.status(200).send(project)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    })
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: gets a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: a project object
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', (req, res) => {
  knex('project_table')
    .select('*')
    .where({ id: req.params.id })
    .then((project) => {
      if (project.length) {
        res.status(200).send(project[0])
      } else {
        res.status(404).send("Project not found")
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    })
});

/**
 * @swagger
 * /{id}/messages:
 *   get:
 *     summary: Get all chat messages for a project
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to fetch messages from.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of chat messages.
       500:
*         description : Internal Server Error.
 */
router.get('/:id/messages', (req, res) => {
  knex('chatposts')
    .select('*')
    .where({ project_id: req.params.id })
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(err => {
      console.error("Error fetching chat messages:", err);
      res.status(500).send("Internal Server Error");
    });
});

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: creates a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: project created successfully!
 *       400:
 *         description: Invalid submitter or accepted_by_id
 *       500:
 *         description: Internal Server Error
 */
router.post('/', (req, res) => {
  const { submitter_id, accepted_by_id, name, problem_statement, is_accepted, is_approved, is_completed, bounty_payout, github_url, program_languages, date_created, end_date, project_state, coders_needed } = req.body;

  knex("user_table")
    .whereIn('id', [submitter_id, accepted_by_id])
    .then((userRows) => {
      if (userRows.length === 0) {
        res.status(400).send("Invalid submitter or accepted_by_id");
        return;
      }

      knex("project_table")
        .insert({
          name,
          problem_statement,
          is_approved,
          is_accepted,
          is_completed,
          submitter_id,
          accepted_by_id,
          bounty_payout,
          github_url,
          program_languages,
          date_created,
          end_date,
          project_state,
          coders_needed
        })
        .returning('*')
        .then((newProject) => {
          res.status(201).json(newProject[0]);
          console.log('Project creation was successful');
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Internal Server Error");
        });
    })
});

/**
 * @swagger
 * /{id}/messages:
 *   post:
 *     summary: Create a new chat message for a project
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to which the message belongs.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Message created successfully.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/:id/messages', (req, res) => {
  knex('chatposts')
  .insert(req.body)
  .returning('*')
  .then(messages => {
    const createdMessage = messages[0];
    res.status(201).json(createdMessage);
  })
  .catch(err => {
    console.error("Error saving chat message:", err);
    res.status(500).send("Internal Server Error");
  });
});

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: updates a project
 *     tags: [Projects]
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
 *         description: Project updated successfully
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', (req, res) => {
    knex('project_table')
    .where({ id: req.params.id })
    .update({
      name: req.body.name,
      problem_statement: req.body.problem_statement,
      submitter: req.body.submitter,
      is_approved: req.body.is_approved,
      is_accepted: req.body.is_accepted,
      accepted_by_id: req.body.accepted_by_id,
      is_completed: req.body.is_completed,
      bounty_payout: req.body.bounty_payout,
      github_url: req.body.github_url,
      program_language_type: req.body.program_language_type,
      date_created: req.body.date_created,
      end_date: req.body.end_date,
      desired_number_coders: req.body.desired_number_coders,
      project_state: req.body.project_state,
    })
    .then((updateRows) => res.status(200).send('project updated'))
});

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: deletes a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *         description: Project deleted successfully!
 */
router.delete('/:id', (req, res) => {
    knex('project_table')
    .where({ id: req.params.id })
    .del()
    .then(res.status(204).send('project deleted'))
});

module.exports = router;