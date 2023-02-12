import { NextFunction, Request, Response } from 'express';

import { decodePipeline } from '@/utils/file';

export default class ImportController {
  // TODO add config middleware
  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Apply custom transform to read and parse streaming data
      req
        .pipe(decodePipeline('utf-8', ',', 'txt', true))
        .on('data', row => {
          // TODO fetch API data
          console.log(row);
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
