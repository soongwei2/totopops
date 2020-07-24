const express = require('express');
const config = require('config');
const logUtils = require('./utilities/log.utils');
const authSyncDatabase = require('@soongwei/mysql-db').authSyncDatabase;

const app = express();

const middlewares = require('./middlewares')(app);
middlewares.configureMiddlewares();

Promise.resolve().then(() => {
  const services = require('./services');
  logUtils.initDebugLogging(app);
  services(app);
  logUtils.initErrorLogging(app);

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.info(`Service started listening on port: ${port}`)
  });
}).catch((error) => {
  console.error("Problem starting service: ", error);
})

module.exports = app;