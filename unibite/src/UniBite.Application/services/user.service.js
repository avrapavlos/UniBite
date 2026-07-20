const User = require('../../UniBite.Domain/entities/User');
const { NotFoundError, DomainError } = require('../../UniBite.Domain/errors/DomainError');
const { v4: uuidv4 } = require('uuid');

// This is the "use case" layer — orchestrates domain rules, talks to the
// repository ONLY through the interface (dependency injected via constructor,
// same idea as constructor injection in .NET services).

class UserService {
  /**
   * @param {IUserRepository} userRepository - injected concrete implementation
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError(`User with id ${id} not found`);
    return user;
  }

  async createUser({ name, email }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new DomainError('A user with this email already exists', 409);

    const user = new User({ id: uuidv4(), name, email });
    return this.userRepository.create(user);
  }
}

module.exports = UserService;
