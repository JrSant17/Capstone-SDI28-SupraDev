const express = require('express');
const app = express();
const port = 8080;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./docs/swaggerDef');
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);

/**
 * Define the routes available for the API
 */
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects.js');

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRoutes);

app.use('/projects', projectRoutes);

//TODO: change endpoints to remove bounty aspect
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

app.listen(port, () => console.log(`Express server listening in on port ${port} with environment: ${process.env.NODE_ENV}`))

module.exports = app;