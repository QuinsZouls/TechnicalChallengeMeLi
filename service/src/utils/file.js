const os = require('os');
const fs = require('fs');
const readline = require('readline');
const ProcessQueue = require('./queue');

/**
 * It takes two arrays of strings, and returns an object with the first array as keys and the second
 * array as values
 * @param {string[]} keys
 * @param {string[]} values
 * @returns An object with the keys and values from the two arrays.
 */
function applyHeaders(keys = [], values = []) {
  const mappedKeys = {};
  for (const i in keys) {
    mappedKeys[keys[i]] = values[i];
  }
  return mappedKeys;
}
const DEFAULT_OPTIONS = {
  encoder: 'utf-8',
  separator: ',',
  format: 'txt',
  header: [],
};
/**
 * It takes a string, decodes it, splits it into an array, and returns the array
 * @param {string} line - string - the line to decode
 * @param options - {
 * @returns An array of strings or an object.
 */
function lineDecoder(line, options = DEFAULT_OPTIONS) {
  const { separator, encoder, format, header } = options;
  // Remove end of lines
  if (!line) {
    return [];
  }
  const decodedStr = Buffer.from(line, encoder).toString(encoder);
  if (format === 'json') {
    return JSON.parse(line);
  }
  if (header?.length) {
    return applyHeaders(header, decodedStr.split(separator));
  }
  return decodedStr.split(separator);
}

/**
 * It reads a file line by line, and for each line it creates a task in a queue
 * @param path - The path to the file to be processed.
 * @param options
 */
function processFile(path = '', options = {}) {
  let header = null;
  const { encoder = 'utf-8', format, separator } = options;
  const queue = new ProcessQueue(parseInt(os.cpus().length * 1.5));
  const readInterface = readline.createInterface({
    input: fs.createReadStream(path, { flags: 'r', encoding: encoder }),
  });
  queue.on('queue_full', () => {
    readInterface.pause();
  });
  queue.on('task_completed', () => {
    readInterface.resume();
  });
  queue.on('done', () => {
    readInterface.close();
    console.log('queue complete with errors: ' + queue.errors);
  });
  readInterface.on('line', data => {
    let row;
    try {
      if (header === null && format !== 'json') {
        header = lineDecoder(data, {
          encoder,
          separator,
          format,
        });
      } else {
        row = lineDecoder(data, {
          encoder,
          separator,
          format,
          header,
        });
        queue.createTask(row);
      }
    } catch (e) {
      console.log(`Error al procesar la línea: ${data}`, e);
    }
  });
}
module.exports = {
  lineDecoder,
  processFile,
  applyHeaders,
};
