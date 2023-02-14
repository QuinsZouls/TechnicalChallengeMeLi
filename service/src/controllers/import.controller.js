const os = require('os');
const fs = require('fs');
const { decodePipeline } = require('../utils/file');
const ProcessQueue = require('../utils/queue');

class ImportController {
  processQueue = new ProcessQueue(parseInt(os.cpus().length * 1.5));
  // TODO add config middleware
  uploadFile = async (req, res, next) => {
    try {
      const { path, encoding = 'utf-8', separator = ',', format = 'txt' } = req.body;
      // Apply custom transform to read and parse streaming data
      if (fs.existsSync(path)) {
        const file = fs.createReadStream(path);
        this.processQueue.on('queue_full', () => {
          if (!file.isPaused()) {
            file.pause();
            console.log('queue_full');
          }
        });
        this.processQueue.on('done', () => {
          file.resume();
          console.log('queue complete');
        });
        file
          .pipe(decodePipeline(encoding, separator, format, true))
          .on('data', row => {
            // TODO fetch API data
            this.processQueue.createTask(row);
          })
          .on('error', error => next(error));
        res.status(200).json({
          status: 'batched',
        });
      } else {
        res.status(404).json({
          message: 'file not found',
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
module.exports = ImportController;
