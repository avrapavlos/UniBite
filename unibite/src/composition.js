// COMPOSITION ROOT
// ------------------------------------------------------------------
// This file is the closest JS equivalent to .NET's Program.cs DI
// registration (`builder.Services.AddScoped<IUserRepository, UserRepository>()`).
// It's the ONLY place concrete Infrastructure classes get constructed and
// wired into Application services. Everything else depends on abstractions
// passed in, not concrete classes reached for directly.

const UserRepository = require('./UniBite.Infrastructure/repositories/UserRepository');
const UserService = require('./UniBite.Application/services/user.service');
const UserController = require('./UniBite.API/controllers/user.controller');

function buildContainer() {
  // Infrastructure (concrete adapters)
  const userRepository = new UserRepository();

  // Application (business logic, depends on the repository via constructor)
  const userService = new UserService(userRepository);

  // API (controllers, depend on services)
  const userController = new UserController(userService);

  return {
    userController,
  };
}

module.exports = buildContainer;
