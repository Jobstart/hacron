// @flow

import fs from 'fs';

import logger from './logger';

const AMQP_SSL_PATH: string = '/opt/ssl/amqp.pem';
const ETCD_SSL_PATH: string = '/opt/ssl/etcd.pem';

let amqp: ?Buffer = null;
let etcd: ?Buffer = null;

try {
  amqp = fs.readFileSync(AMQP_SSL_PATH);
  logger.info('using ssl for amqp');
} catch (e) {
  logger.info('not using ssl for amqp');
};

try {
  etcd = fs.readFileSync(ETCD_SSL_PATH);
  logger.info('using ssl for etcd');
} catch (e) {
  logger.info('not using ssl for etcd');
};


export {
  amqp,
  etcd
};
