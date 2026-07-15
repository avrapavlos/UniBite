const logger = require('../../UniBite.Infrastructure/logging/logger');

// Express recognizes this as error-handling middleware ONLY because it has
// 4 arguments (err, req, res, next) — this is a hard Express requirement,
// unlike .NET where exception middleware is registered explicitly by type.
// This should be the LAST app.use() call in app.js.

function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(err.stack || err);
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
}

function notFoundMiddleware(req, res) {
  res.status(404).json({ error: { message: `Route ${req.originalUrl} not found` } });
}

module.exports = { errorMiddleware, notFoundMiddleware };
