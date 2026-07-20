// Without TypeScript or a validation lib, we do a lightweight manual check here.
// This is the equivalent of a [ApiController] auto-validating a DTO in .NET,
// just done by hand. Swap this out for Joi/Zod/express-validator if the project grows.

function validateCreateUserDto(body) {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  if (!body.email || typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.push('email is required and must be a valid email address');
  }

  return errors;
}

module.exports = { validateCreateUserDto };
