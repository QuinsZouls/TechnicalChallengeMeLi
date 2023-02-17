const fs = require('fs');
const { processFile } = require('../utils/file');

class ImportController {
  // TODO add config middleware
  uploadFile = async (req, res, next) => {
    try {
      const { path, encoder = 'utf-8', separator = ',', format = 'txt' } = req.body;
      // Apply custom transform to read and parse streaming data
      if (fs.existsSync(path)) {
        processFile(path, { encoder, separator, format });
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
