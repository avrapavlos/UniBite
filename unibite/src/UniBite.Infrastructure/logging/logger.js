// Minimal logger wrapper. Swap console.* for winston/pino later without
// touching any code that calls logger.info/error — same idea as coding
// against ILogger<T> instead of Console.WriteLine directly in .NET.

const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

module.exports = logger;
