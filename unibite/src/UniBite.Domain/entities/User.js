// Pure domain entity — no Express, no DB driver, no framework imports.
// This is the equivalent of a C# POCO / domain model in Clean Architecture.

class User {
  constructor({ id, name, email, createdAt }) {
    if (!name) throw new Error('User must have a name');
    if (!email) throw new Error('User must have an email');

    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = User;
