const { Router } = require('express');

// Routes are a factory function that takes the controller as a parameter
// (dependency injection by hand). This keeps routing free of any
// direct construction of services/repositories.

function userRoutes(userController) {
  const router = Router();

  router.get('/', userController.getAll);
  router.get('/:id', userController.getById);
  router.post('/', userController.create);

  return router;
}

module.exports = userRoutes;
