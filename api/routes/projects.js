/**
 * This file contains all http methods for the endpoint /projects
 * Thus, the starting paths for all these router handlers of '/',
 * corresponds to /projects
 */
const express = require('express');
const router = express.Router();
const knex = require('knex')(
require('../knexfile.js')
[process.env.NODE_ENV || 'development']);
const projectFields = [
  'id',
  'name',
  'problem_statement',
  'submitter_id',
  'is_approved',
  'is_accepted',
  'accepted_by_id',
  'is_completed',
  'bounty_payout',
  'github_url',
  'coders_needed',
  'program_languages',
  'project_owner',
  'date_created',
  'end_date',
  'project_state',
  'priority_level',
  'kickoff_startdate',
  'kickoff_enddate',
  'development_startdate',
  'development_enddate',
  'testing_startdate',
  'testing_enddate',
  'showcase_startdate',
  'showcase_enddate',
  'funding_startdate',
  'funding_enddate',
  'deployment_startdate',
  'deployment_enddate',
  'por_startdate',
  'por_enddate',
  'funding_source',
  'funding_poc',
  'estimated_cost',
  'funding_department',
  'url'
];

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
router.get("/", (req, res) => {
  let params = req.query;

  if (Object.keys(params).length === 0) {
    //normal request for ALL projects with no parameter fields
    knex('project_table')
    .select('*')
    .then((project) => {
      res.status(200).send(project)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    })
  } else{
    //request for specific projects with specified field parameters.
    _getProjectQueryEntries(res, params);
  }
});

/**
 * Async handles the advanced query for projects
 * @param {*} res the response to send back
 * @param {*} params the query arameters provided by the user
 * @returns res
 */
async function _getProjectQueryEntries(res, params) {
  let query = knex('project_table').select("*");

  projectFields.forEach(field => {
      console.log(`process field ${field}`)
      if (params[field]) {
        if (field == 'submitter_id' || field == 'accepted_by_id' || field == 'bounty_payout' ||
           field == 'coders_needed' || field == 'project_owner' || field == 'priority_level') {
          query = query.where(field, '=', parseInt(params[field]));
        } else if (field == 'is_accepted' || field == 'is_approved' || field == 'is_completed') {
          query = query.where(field, '=', params[field] === 'true' || params[field] === '1');
        } else if (field == 'date_created' || field == 'end_date' || 
          field.endsWith('_startdate') || field.endsWith('_enddate')) {
            const dateValue = new Date(params[field]);
            if (!isNaN(dateValue.getTime())) {
              query = query.whereRaw(`DATE(${field}) = ?`, [dateValue.toISOString().split('T')[0]]);
            }
        } else if(field == 'estimated_cost') {
          query = query.where(field, '=', parseFloat(params[field]));
        }
        else {
          query = query.where(field, 'LIKE', `%${params[field]}%`);
        }
      }
    });

    console.log(`built final query: ${query}`)
    const result = await query;
    console.log(`final result ${JSON.stringify(result)}`)
    if(!result){
      return res.status(404).send("No projects found!");
    }
    return res.status(200).send(result);
}



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

router.post('/', async (req, res) => {
  //whenever a person creates a project they need to be automatically associated with it!
  try {
    const {
      submitter_id,
      name,
      coders_needed,
      problem_statement,
      program_languages,
      project_owner,
      requirements,
      end_date,
      url,
    } = req.body;

    if (!submitter_id || !name || !coders_needed || !problem_statement || !project_owner) {
      console.log(`missing fields`);
      return res.status(400).json({ 
        message: "Missing required fields." 
      });
    }

    const [submitter] = await knex("user_table").where('id', submitter_id);

    if (!submitter) {
      return res.status(400).json({ message: "Submitter id is not registered in the system." });
    }

    const [newProject] = await knex("project_table")
      .insert({
        name: name,
        problem_statement: problem_statement,
        submitter_id: submitter.id,
        accepted_by_id: null,
        is_approved: false,
        is_accepted: false,
        is_completed: false,
        bounty_payout: 0,
        github_url: null,
        program_languages: program_languages || null,
        date_created: knex.fn.now(),
        end_date: end_date || null,
        coders_needed: coders_needed || 0,
        requirements: requirements || null,
        url: url || null,
      })
      .returning('*');

    try {
      const addSubmitterProject = await knex('user_projects')
      .insert({ user_id: submitter_id, project_id: newProject.id})
      .catch(err => {
        console.error("Error creating user project association:", err);
        res.status(500).json({ error: "Internal server error" });
      });

    } catch(err) {
      console.log(`${err} failed to add user to association table for new project: ${JSON.stringify(newProject)}`);
    }

    return res.status(201).json({
      message: "Project successfully created.",
      project: newProject,
      submitter: {
        project_name: name,
        email: submitter.email,
      }
    });

  } catch (err) {
    console.error("Error inserting project:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
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
      coders_needed: req.body.coders_needed,
      project_state: req.body.project_state,
      funding_poc: req.body.funding_poc,
      url: req.body.url,
    })
    .then(() => res.status(200).send('project updated'))
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

/**
 */
router.delete('/:id/messages', (req, res) => {
  knex('chatposts')
    .where({
      project_id: req.body.project_id,
      id: req.body.post_id
    })
    .del()
    .then(() => {
      res.status(200).json('message deleted')
    })
    .catch(err => {
      console.error("Error delete chat messages:", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;