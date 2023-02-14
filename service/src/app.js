const express = require('express');
const mongoose = require('mongoose');
const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE } = require('./config');
const errorMiddleware = require('./middlewares/error.middleware');

class App {
  constructor(routes) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = parseInt(PORT) || 3000;

    this.#connectToDatabase();
    this.#initializeMiddlewares();
    this.#initializeRoutes(routes);
    this.#initializeErrorHandling();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  getServer() {
    return this.app;
  }

  async #connectToDatabase() {
    await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
  }

  #initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  #initializeRoutes(routes) {
    for (const route of routes) {
      this.app.use('/', route.router);
    }
  }

  #initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

module.exports = App;
