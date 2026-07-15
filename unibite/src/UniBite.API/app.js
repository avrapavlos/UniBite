const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const buildRouter = require('./routes');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/error.middleware');
const buildContainer = require('../composition');

// app.js is the equivalent of Startup.cs / the middleware-configuration
// half of Program.cs — it builds the Express pipeline but does NOT start
// listening (that's server.js's job, kept separate so tests can import
// the app without binding a port).

function createApp() {
  const app = express();
  const container = buildContainer();

  // --- global middleware (order matters, same as .NET's pipeline) ---
  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- health check ---
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // --- routes ---
  app.use('/api/v1', buildRouter(container));

  // --- 404 + centralized error handler (must be registered last) ---
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

module.exports = createApp;
