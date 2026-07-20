const { validateCreateUserDto } = require('../../UniBite.Application/dtos/CreateUserDto');

// Controllers stay thin: parse request, call service, shape response.
// No business logic here — same principle as a .NET [ApiController] action
// that just calls into an injected service.

class UserController {
  /**
   * @param {import('../../UniBite.Application/services/user.service')} userService
   */
  constructor(userService) {
    this.userService = userService;

    // bind so these can be passed directly as Express route handlers
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
  }

  async getAll(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ data: users });
    } catch (err) {
      next(err); // hand off to centralized error middleware
    }
  }

  async getById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const errors = validateCreateUserDto(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await this.userService.createUser(req.body);
      res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
