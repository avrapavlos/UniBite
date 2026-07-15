// JS has no `interface` keyword like C#. This class documents the contract
// (the "port" in ports-and-adapters / hexagonal architecture).
// It's not enforced by a compiler — it's enforced by convention and, optionally, tests.
// UserRepository in Infrastructure must implement every method below.

class IUserRepository {
  async findAll() {
    throw new Error('Not implemented');
  }

  async findById(id) {
    throw new Error('Not implemented');
  }

  async findByEmail(email) {
    throw new Error('Not implemented');
  }

  async create(user) {
    throw new Error('Not implemented');
  }
}

module.exports = IUserRepository;
