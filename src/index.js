import 'source-map-support/register';

import { CronJob } from 'cron';
import express from 'express';
import debug from 'debug';
import uuid from 'uuid';

import { AlreadyLockedError } from 'microlock';

import connect from './amqp';
import lock from './lock';

import stats from './stats';

import {
  MONITOR_PORT,
  CRON_TIME
} from './environment';

const log = debug('hacron:index');

async function onTick (publish) {
  try {
    const d = new Date();

    log('attemping race for lock');

    await lock.lock();

    log('won race for lock');
    log(`publishing tick ${d.toISOString()}`);

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
      log('lost race for lock');
    } else {
      console.trace(e);
      throw e;
    }
  }
}

async function main () {
  const publish = await connect();

  log(`running on cron time ${CRON_TIME}`);

  const cronTime = CRON_TIME;
  const start = true;

  const tick = new CronJob({
    cronTime,
    onTick: () => onTick(publish),
    start
  });

  const app = express();

  app.get('/monitor', (req, res) => {
    log('handling request for stats');
    res.status(200).send(stats());
  });

  app.listen(MONITOR_PORT);

  log(`monitor listening on port ${MONITOR_PORT}`);
}

main().catch((e) => {
  console.trace(e);
  process.exit(1);
});
