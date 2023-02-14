const os = require('os');
const { decodePipeline } = require('../utils/file');
const ProcessQueue = require('../utils/queue');
const { MAX_THREADS } = require('../config');

class ImportController {
  processQueue = new ProcessQueue(os.cpus().length);
  // TODO add config middleware
  uploadFile = async (req, res, next) => {
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
module.exports = ImportController;
