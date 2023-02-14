const { Transform } = require('stream');

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

/**
 * It takes a string, decodes it, splits it into an array, and returns the array
 * @param {string} line - string - the line to decode
 * @param options - {
 * @returns An array of strings or an object.
 */
function lineDecoder(line, options = DEFAULT_OPTIONS) {
  const { separator, encoder, format, header } = options;
  // Remove end of lines
  const decodedStr = Buffer.from(line, encoder).toString(encoder).replace('\r', '');
  if (format === 'json') {
    return JSON.parse(decodedStr);
  }
  if (header?.length) {
    return applyHeaders(header, decodedStr.split(separator));
  }
  return decodedStr.split(separator);
}

/**
 * It takes a string, splits it into lines, and then splits each line into an array of strings.
 * @param {BufferEncoding} encoder - BufferEncoding - The encoding of the file.
 * @param {string} separator - the separator used in the csv file
 * @param {'json' | 'txt'} format - 'json' | 'txt'
 * @param {boolean} useHeader - boolean - if true, the first line of the file will be used as the
 * header
 * @returns A Transform stream
 */
function decodePipeline(encoder, separator, format, useHeader) {
  let header = null;
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      // Decode binary chunk to string
      const data = chunk.toString(encoding);
      const lines = data.split('\n');
      console.log(lines.length)
      for (const line of lines) {
        if (line.length) {
          if (useHeader) {
            if (header === null) {
              header = lineDecoder(line, {
                encoder,
                separator,
                format,
              });
            } else {
              this.push(
                // decode line with header
                lineDecoder(line, {
                  encoder,
                  separator,
                  header,
                  format,
                }),
              );
            }
          } else {
            // Send decoded line
            this.push(
              lineDecoder(line, {
                encoder,
                separator,
                format,
              }),
            );
          }
        }
      }
      callback();
    },
  });
}
module.exports = {
  decodePipeline,
  lineDecoder,
};
