/**
 * This file contains all the http methods for the endpoint user_projects
 * Thus, the starting paths for all these router handlers of '/',
 * corresponds to /user_projects
 */
const express = require('express');
const router = express.Router();
const userProjectsFields = ['user_id', 'project_id', 'datetime_joined'];

const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);

router.get('/', (req, res) => {
    let params = req.query;
    console.log(`request for ${req.path} with params: ${JSON.stringify(params)}`);
  
  
    if (Object.keys(params).length === 0) {
      //normal request for ALL users with no parameter fields
      knex('user_projects')
      .select('*')
      .then((user_projects) => {
        if (!user_projects) {
          return res.status(404).send("No user_projects found!");
        }
        res.status(200).send(user_projects)
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Internal server error");
      });
    } else{
      //request for specific users with specified field parameters.
      _getUserProjectQueryEntries(res, params);
    }
});

/**
 * Async handles the advanced query for user_projects?
 * @param {*} res 
 * @param {*} params 
 * @returns 
 */
async function _getUserProjectQueryEntries(res, params) {
    //build out the knex query for fields provided by user
    let query = knex('user_projects').select("*");
    userProjectsFields.forEach(field => {
      console.log(`process field ${field}`)
      if (params[field]) {
        if (field == 'datetime_joined') {
            query = query.where(field, '=', new Date(params[field]));
        } else{
            query = query.where(field, '=', parseInt(params[field]));
        }
      }
    });
  
    console.log(`built final query: ${query}`)
    const result = await query;
    console.log(`final result ${JSON.stringify(result)}`)
    if(!result){
      return res.status(404).send("No user_projects found!");
    }
    return res.status(200).send(result);
  };

router.post('/', (req, res) => {
    const { user_id, project_id } = req.body;
    console.log(`incoming request is: user${user_id} for project: ${project_id}`)
    if (!user_id || !project_id) {
        return res.status(400).json({ error: "missing fields" });
    }

    knex('user_projects')
        .insert({ user_id, project_id })
        .then(() => {
            res.status(201).json({ message: "User project insertion success" });
        })
        .catch(err => {
            console.error("Error creating user project association:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

module.exports = router;