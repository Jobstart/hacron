// @flow

import { Logger, transports } from 'winston';

const { Console } = transports;

const logger: Logger = new Logger({
  transports: [
    new Console({
      timestamp: () => new Date().toISOString(),
      level: 'verbose',
      colorize: true
    })
  ]
});

export default logger;
