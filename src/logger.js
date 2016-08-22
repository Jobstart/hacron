import winston from 'winston';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: () => new Date().toISOString(),
      level: 'verbose',
      colorize: true
    })
  ]
});

export default logger;
