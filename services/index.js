const monitor = require('./monitor');

const errorResponseHandler = require('../utilities/handler/errorDef').errorResponseHandler;
const errorClientHandler = require('../utilities/handler/errorDef').errorClientHandler;

class ServicesIndex {
  constructor(app) {
    this.app = app;
  }

  registerServices() {
    
    this.app.use('/monitor', monitor);
    this.app.use('/soongwei/TPBService', require('./torrent-api'));///soongwei/TPBService/searchGET?type=1&search=

    this.app.use(errorResponseHandler);
    this.app.use(errorClientHandler);
 
  }
}

module.exports = (app) => {
  return new ServicesIndex(app).registerServices();
}