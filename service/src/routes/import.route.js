const { Router } = require('express');
const ImportController = require('../controllers/import.controller');

class ImportRoute {
  path = '/import';
  router = Router();
  Controller = new ImportController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}`, this.Controller.uploadFile);
  }
}

module.exports = ImportRoute;
