const fs = require('fs');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const ImportController = require('../../controllers/import.controller');

describe('ImportController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
    const importController = new ImportController();
    app.post('/import', importController.uploadFile);
  });

  describe('POST /import', () => {
    test('should return 404 if file does not exist', async () => {
      const response = await request(app).post('/import').send({ path: 'non-existing-file.txt' });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'file not found' });
    });

    test('should process the file jsonline and return 200', async () => {
      const testFilePath = 'testFile.txt';
      const testFileContent = '{"site":"MLA","id":"750925229"}';
      fs.writeFileSync(testFilePath, testFileContent);
      const response = await request(app).post('/import').send({ path: testFilePath, format: 'json' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'batched' });
      fs.unlinkSync(testFilePath);
    });
  });
});
