const { config } = require('dotenv');

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, ML_API_SERVICE_URL, MAX_THREADS = 8 } = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  ML_API_SERVICE_URL,
  MAX_THREADS,
};
