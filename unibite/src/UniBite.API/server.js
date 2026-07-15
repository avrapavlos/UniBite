const createApp = require('./app');
const config = require('../UniBite.Infrastructure/config/env');
const logger = require('../UniBite.Infrastructure/logging/logger');

const app = createApp();

app.listen(config.port, () => {
  logger.info(`UniBite API running on http://localhost:${config.port} [${config.nodeEnv}]`);
});
