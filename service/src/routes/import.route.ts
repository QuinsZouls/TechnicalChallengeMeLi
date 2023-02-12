import { Router } from 'express';
import ImportController from '@/controllers/import.controller';
import { Routes } from '@/interfaces/routes.interface';

class ImportRoute implements Routes {
  public path = '/import';
  public router = Router();
  public Controller = new ImportController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.Controller.uploadFile);
  }
}

export default ImportRoute;
