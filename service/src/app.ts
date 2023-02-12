import express from 'express';
import mongoose from 'mongoose';
import { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE } from '@/config';
import { Routes } from '@/interfaces/routes.interface';
import errorMiddleware from '@/middlewares/error.middleware';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = parseInt(PORT as string) || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  private initializeRoutes(routes: Routes[]) {
    for (const route of routes) {
      this.app.use('/', route.router);
    }
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
