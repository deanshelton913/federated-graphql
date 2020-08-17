const { registrationHandler } = require('./handlers/registration-handler');
const { gateway } = require('./gatewaySingleton');
const { errorHandler } = require('../shared/error-handler');

const express = require('express');
const bodyParser = require('body-parser');
const {apolloServer} = require('./apollo-server');

const {PORT} = process.env;
const port = PORT ? Number(PORT) : 3000;

const expressjs = express();
apolloServer.applyMiddleware({ app: expressjs });

expressjs.use(bodyParser.json());
expressjs.post('/register', registrationHandler);

expressjs.use(errorHandler);

expressjs.listen(port, () => {
  console.log(`🚀Gateway ready at http://localhost:${port}`);
});
