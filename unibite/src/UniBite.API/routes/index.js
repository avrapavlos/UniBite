const { Router } = require('express');
const userRoutes = require('./user.routes');

// Aggregates every feature's routes under one router, mounted at /api/v1
// in app.js. Add new feature routers here as the app grows.

function buildRouter({ userController }) {
  const router = Router();

  router.use('/users', userRoutes(userController));

  return router;
}

module.exports = buildRouter;
