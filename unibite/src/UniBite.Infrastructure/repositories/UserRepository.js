const IUserRepository = require('../../UniBite.Application/interfaces/IUserRepository');

// Concrete adapter. This is an in-memory implementation so the boilerplate
// runs with zero DB setup. Swap this class's internals for Mongoose/Prisma/Sequelize
// calls later — nothing in Application or API needs to change, since they only
// depend on the IUserRepository contract.

class UserRepository extends IUserRepository {
  constructor() {
    super();
    this._users = []; // in-memory "table"
  }

  async findAll() {
    return this._users;
  }

  async findById(id) {
    return this._users.find((u) => u.id === id) || null;
  }

  async findByEmail(email) {
    return this._users.find((u) => u.email === email) || null;
  }

  async create(user) {
    this._users.push(user);
    return user;
  }
}

module.exports = UserRepository;
