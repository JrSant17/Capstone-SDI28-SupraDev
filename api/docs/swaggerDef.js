const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'SupraDev API documentation',
      version: '1.0.0',
      description:
        'This is a the REST API documentation to interact with SupraDev backend.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
  };

  module.exports = swaggerDefinition;