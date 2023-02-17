const { applyHeaders, lineDecoder } = require('../../utils/file');

describe('applyHeaders', () => {
  test('should return an object with keys from the first array and values from the second array', () => {
    const keys = ['name', 'email'];
    const values = ['John', 'john@example.com'];
    const expected = { name: 'John', email: 'john@example.com' };
    expect(applyHeaders(keys, values)).toEqual(expected);
  });

  test('should handle empty arrays and return an empty object', () => {
    const expected = {};
    expect(applyHeaders([], [])).toEqual(expected);
  });
});

describe('lineDecoder', () => {
  test('should split a line by separator and return an array of strings', () => {
    const line = '1,John,john@example.com';
    const options = { separator: ',' };
    const expected = ['1', 'John', 'john@example.com'];
    expect(lineDecoder(line, options)).toEqual(expected);
  });

  test('should handle empty line and return an empty array', () => {
    const line = '';
    const options = { separator: ',' };
    const expected = [];
    expect(lineDecoder(line, options)).toEqual(expected);
  });

  test('should parse a JSON line and return an object', () => {
    const line = '{"id": 1, "name": "John", "email": "john@example.com"}';
    const options = { format: 'json' };
    const expected = { id: 1, name: 'John', email: 'john@example.com' };
    expect(lineDecoder(line, options)).toEqual(expected);
  });

  test('should handle a line with header and return an object with keys from header', () => {
    const line = '1,John,john@example.com';
    const header = ['id', 'name', 'email'];
    const options = { separator: ',', header };
    const expected = { id: '1', name: 'John', email: 'john@example.com' };
    expect(lineDecoder(line, options)).toEqual(expected);
  });
});
