require('dotenv').config();

// Centralized place to read env vars. Import this instead of using
// process.env directly all over the codebase — equivalent of binding
// appsettings.json into a strongly-typed options object in .NET.

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config;
