// Import necessary modules
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
// Import application specific modules
const config = require("./config/config");
const logger = require("./utils/logger");
const routes = require("./api/routes/routes");
const errorHandler = require("./api/middlewares/errorHandler");

// Define the Server class
class Server {
  constructor() {
    this.app = express();
    this.config = config;
    this.server = null;
    
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // API routes
    this.app.use(this.config.apiPrefix, routes);

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        error: "Route not found"
      });
    });
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  createServer() {
    if (this.config.https === 'true') {
      logger.info("🔒 HTTPS is enabled");
      return this.createHTTPSServer();
    } else {
      logger.info("🔒 HTTPS is disabled, using HTTP");
      return this.createHTTPServer();
    }
  }

  createHTTPServer() {
    logger.info("Creating HTTP server");
    this.config.port = this.config.http_port;
    this.config.protocol = "http";
    return http.createServer(this.app);
  }

  createHTTPSServer() {
    try {
      logger.info("Creating HTTPS server");
      this.config.port = this.config.https_port;
      this.config.protocol = "https";

      const keyPath = path.resolve(this.config.ssl.keyPath);
      const certPath = path.resolve(this.config.ssl.certPath);

      // Check if SSL files exist
      if (!fs.existsSync(keyPath)) {
        throw new Error("❌ SSL key file not found: " + this.config.ssl.keyPath);
      }
      if (!fs.existsSync(certPath)) {
        throw new Error("❌ SSL certificate file not found: " + this.config.ssl.certPath);
      }

      const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };

      logger.info("Using SSL key: " + this.config.ssl.keyPath);
      logger.info("Using SSL cert: " + this.config.ssl.certPath);

      return https.createServer(options, this.app);
    } catch (error) {
      logger.error("❌ Failed to create HTTPS server: " + error.message);
      logger.warn("Falling back to HTTP server");
      return this.createHTTPServer();
    }
  }

  start() {
    // Create and start the server
    this.server = this.createServer();
    // Start listening on the configured port
    this.server.listen(this.config.port, () => {
      logger.info("Server running on port " + this.config.port);
      logger.info("Protocol: " + this.config.protocol);
      logger.info("API endpoint: " + this.config.protocol + "://<server_url>:" + this.config.port + this.config.apiPrefix);
      //logger.info(`API endpoint: ${protocol}://localhost:${this.config.port}${this.config.apiPrefix}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      this.server.close(() => {
        logger.info("HTTP server closed");
      });
    });
  }
}

// Start the server
const server = new Server();
server.start();

module.exports = Server;