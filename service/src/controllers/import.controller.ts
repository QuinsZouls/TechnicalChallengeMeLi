import { NextFunction, Request, Response } from 'express';
import os from 'node:os';
import { decodePipeline } from '@/utils/file';
import ProcessQueue from '@/utils/queue';

export default class ImportController {
  private processQueue = new ProcessQueue(os.cpus().length);
  // TODO add config middleware
  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Apply custom transform to read and parse streaming data
      req
        .pipe(decodePipeline('utf-8', ',', 'txt', true))
        .on('data', row => {
          // TODO fetch API data
          this.processQueue.createTask(row);
        })
        .on('error', error => next(error));
      res.status(200).json({
        status: 'batched',
      });
    } catch (error) {
      next(error);
    }
  };
}
