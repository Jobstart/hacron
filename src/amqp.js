import amqplib from 'amqplib';

import logger from './logger';
import { amqp } from './ssl';

import {
  AMQP_URL,
  EXCHANGE_NAME,
  EXCHANGE_DURABLE
} from './environment';

const opts = amqp ? {
  ca: amqp
} : {};

function handleConnectionError (e) {
  logger.info('amqp connection error');
  console.trace(e);
  process.exit(1);
}

export function objectToBuffer (obj) {
  return new Buffer(JSON.stringify(obj), 'utf8');
}

export function bufferToObject (buffer) {
  return JSON.parse(buffer.toString('utf8'));
}

export default async function connect () {
  try {
    logger.info('creating amqp connection');
    const connection = await amqplib.connect(AMQP_URL, opts);
    logger.info('amqp connection established');

    connection.on('close', () => handleConnectionError(new Error('amqp connection closed')));
    connection.on('error', (e) => handleConnectionError(e));

    logger.info('creating amqp channel');
    const channel = await connection.createChannel();
    logger.info('amqp channel created');

    logger.info(`asserting amqp exchange ${EXCHANGE_NAME}${EXCHANGE_DURABLE ? ' as durable exchange' : ''}`);
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', {
      durable: EXCHANGE_DURABLE
    });
    logger.info(`amqp exchange ${EXCHANGE_NAME} asserted`);

    return (data) => channel.publish(EXCHANGE_NAME, 'hacron.tick', objectToBuffer(data), {
      expiration: '30000', //expire after 30 seconds
      contentType: 'application/json',
      contentEncoding: 'utf8',
      timestamp: data.timestamp,
      messageId: data.id,
      type: 'tick',
      appId: 'jobstartinc/hacron'
    });
  } catch (e) {
    handleConnectionError(e);
  }
}
