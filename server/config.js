import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || 'localhost';
const HOST_URL = process.env.HOST_URL || `http://${HOST}:${PORT}`;

assert(PORT, 'Port is required');
assert(HOST, 'Host is required');

export default {
  port: PORT,
  host: HOST,
  hostUrl: HOST_URL,
};
