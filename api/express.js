const express = require('express');
const app = express();
const port = 8080;
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/users', (req, res) => {
  knex('user_table')
    .select('*')
    .then((user) => {
      res.status(200).send(user)
    })
    .catch(err => console.log(err))
})

app.get('/users/:id', (req, res) => {
  knex('user_table')
    .select('*')
    .where({ id: req.params.id })
    .then((user) => {
      res.status(200).send(user)
    })
    .catch(err => console.log(err))
})

app.post('/users', (req, res) => {
  const {
    fname,
    lname,
    email,
    p1_account,
    p1_auth,
    type,
    password,
    availability,
    experience,
    languages,
    operating_systems,
    avatar_url,
    time_available,
    is_supracoder
  } = req.body;

  knex("user_table")
    .insert({
      fname,
      lname,
      email,
      p1_account,
      p1_auth,
      type,
      password,
      availability,
      experience,
      languages,
      operating_systems,
      avatar_url,
      time_available,
      is_supracoder
    })
    .then(() => {
      res.status(201).send("User created successfully");
      console.log("User creation was successful");
    })
    .catch(err => {
      console.error("Error creating user:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.patch('/users/:id', (req, res) => {
  const {
    fname,
    lname,
    email,
    p1_account,
    p1_auth,
    type,
    password,
    availability,
    experience,
    languages,
    operating_systems,
    avatar_url,
    time_available,
    is_supracoder
  } = req.body;

  knex('user_table')
    .where({ id: req.params.id })
    .update({
      fname,
      lname,
      email,
      p1_account,
      p1_auth,
      type,
      password,
      availability,
      experience,
      languages,
      operating_systems,
      avatar_url,
      time_available,
      is_supracoder
    })
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

app.delete('/users/:id', (req, res) => {
  knex('user_table')
    .where({ id: req.params.id })
    .del()
    .then(res.status(204).send('user deleted'))
})

app.get('/projects', (req, res) => {
  knex('project_table')
    .select('*')
    .then((project) => {
      res.status(200).send(project)
    })
    .catch(err => console.log(err))
})

app.get('/projects/:id', (req, res) => {
  knex('project_table')
    .select('*')
    .where({ id: req.params.id })
    .then((project) => {
      res.status(200).send(project)
    })
    .catch(err => console.log(err))
})


// table.increments('id');
// table.string('name');
// table.string('problem_statement');
// table.integer('submitter_id');
// table.foreign('submitter_id').references('user_table.id');
// table.boolean('is_approved');
// table.boolean('is_accepted');
// table.integer('accepted_by_id');
// table.foreign('accepted_by_id').references('user_table.id');
// table.boolean('is_completed');


app.post('/projects', (req, res) => {
  const { submitter_id, accepted_by_id, name, problem_statement, is_accepted, is_approved, is_completed, bounty_payout, github_url } = req.body;

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

        })
        .then((newProject) => {
          res.status(201).send("Project created successfully");
          console.log('Project creation was successful');
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Internal Server Error");
        });
    })
});

//Bounty Chat

//Bounty Get
app.get('/bounties/:bountyId/messages', (req, res) => {
  const bountyId = req.params.bountyId;

  knex('chatposts')
    .select('*')
    .where({ project_id: bountyId })
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(err => {
      console.error("Error fetching chat messages:", err);
      res.status(500).send("Internal Server Error");
    });
});

//Bounty Post
app.post('/bounties/:bountyId/messages', (req, res) => {
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

//Bounty End

app.patch('/projects/:id', (req, res) => {
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
    })
    .then((updateRows) => res.status(200).send('project updated'))
})

app.delete('/projects/:id', (req, res) => {
  knex('project_table')
    .where({ id: req.params.id })
    .del()
    .then(res.status(204).send('project deleted'))
})


app.listen(port, () => console.log(`Express server listening in on port ${port}`))