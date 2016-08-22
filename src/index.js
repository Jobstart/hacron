import 'source-map-support/register';

import { CronJob } from 'cron';
import express from 'express';
import uuid from 'uuid';

import { AlreadyLockedError } from 'microlock';

import logger from './logger';
import connect from './amqp';
import lock from './lock';
import stats from './stats';

import {
  MONITOR_PORT,
  CRON_TIME
} from './environment';

async function onTick (publish) {
  try {
    const d = new Date();

    logger.info('attemping race for lock');

    await lock.lock();

    logger.info('won race for lock');
    logger.info(`publishing tick ${d.toISOString()}`);

    await publish({
      id: uuid.v4().replace(/\W/g, ''),
      minute: d.getMinutes(),
      hour: d.getHours(),
      day_of_month: d.getDate(),
      day_of_week: d.getDay(),
      month: d.getMonth(),
      year: d.getFullYear(),
      iso: d.toISOString(),
      timestamp: d.getTime(),
      timezone_offset: d.getTimezoneOffset()
    });
  } catch (e) {
    if (e instanceof AlreadyLockedError) {
      logger.info('lost race for lock');
    } else {
      console.trace(e);
      throw e;
    }
  }
}

async function main () {
  const publish = await connect();

  logger.info(`running on cron time ${CRON_TIME}`);

  const cronTime = CRON_TIME;
  const start = true;

  const tick = new CronJob({
    cronTime,
    onTick: () => onTick(publish),
    start
  });

  const app = express();

  app.get('/monitor', (req, res) => {
    logger.info('handling request for stats');
    res.status(200).send(stats());
  });

  app.listen(MONITOR_PORT);

  logger.info(`monitor listening on port ${MONITOR_PORT}`);
}

main().catch((e) => {
  console.trace(e);
  process.exit(1);
});
