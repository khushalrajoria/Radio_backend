const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routers/indexRoute.js'];

const doc = {
  info: {
    title: 'Your API Documentation',
    description: 'API documentation for Radiology',
  },
  host: 'localhost:5423',
  basePath: '/api',
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
  security: [{ BearerAuth: [] }], 
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index.js');
});
