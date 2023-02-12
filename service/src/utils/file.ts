import { Transform } from 'stream';

export interface Options {
  encoder: BufferEncoding;
  separator: string;
  format: 'json' | 'txt';
  header?: string[];
}
const DEFAULT_OPTIONS: Options = {
  encoder: 'utf-8',
  separator: ',',
  format: 'txt',
  header: [],
};

/**
 * It takes two arrays of strings, and returns an object with the first array as keys and the second
 * array as values
 * @param {string[]} keys
 * @param {string[]} values
 * @returns An object with the keys and values from the two arrays.
 */
function applyHeaders(keys: string[], values: string[]) {
  const mappedKeys: Record<any, any> = {};
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
export function lineDecoder<TypeDecoded>(line: string, options = DEFAULT_OPTIONS): string[] | TypeDecoded {
  const { separator, encoder, format, header } = options;
  // Remove end of lines
  const decodedStr = Buffer.from(line, encoder).toString(encoder, 0, line.length - 1);
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
export function decodePipeline(encoder: BufferEncoding, separator: string, format: 'json' | 'txt', useHeader: boolean) {
  let header: string[] | null = null;
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const data = chunk.toString(encoding);
      const lines = data.split('\n');
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
