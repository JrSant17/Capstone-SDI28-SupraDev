const express = require('express');
const app = express();
const port = 8080;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./docs/swaggerDef');
const knex = require('knex')(require('./knexfile.js')['development']);

/**
 * Define the routes available for the API
 */
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects.js');
const milestonesRouter = require('./routes/milestones.js'); 

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

app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.originalUrl);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRoutes);

app.use('/projects', projectRoutes);

app.use('/projects', milestonesRouter);


app.listen(port, () => console.log(`Express server listening in on port ${port} with environment: ${process.env.NODE_ENV}`))

module.exports = app;