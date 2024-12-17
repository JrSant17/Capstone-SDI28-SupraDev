const express = require('express');
const app = express();
const port = 8080;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./docs/swaggerDef');

/**
 * Define the routes available for the API
 */
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects.js');
const userProjectRoutes = require('./routes/user_projects.js');
const loginRoute = require('./routes/login.js');
// const milestonesRouter = require('./routes/milestones.js'); 

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRoutes);

app.use('/projects', projectRoutes);

app.use('/user_projects', userProjectRoutes);

app.use('/login', loginRoute);

app.use('/projects', milestonesRouter);


app.listen(port, () => console.log(`Express server listening in on port ${port} with environment: ${process.env.NODE_ENV}`))

module.exports = app;