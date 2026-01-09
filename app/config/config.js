// Import necessary modules
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const config = {
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
    url: process.env.GOOGLE_MAPS_API_URL
  },
  https: process.env.ENABLE_HTTPS,
  port: "",
  protocol: "",
  http_port: process.env.HTTP_PORT,
  https_port: process.env.HTTPS_PORT,
  apiPrefix: process.env.API_PREFIX,
  ssl: {
    keyPath: process.env.SSL_KEY_PATH,
    certPath: process.env.SSL_CERT_PATH
  }
};

module.exports = config;