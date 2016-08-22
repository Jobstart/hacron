import fs from 'fs';

import logger from './logger';

const AMQP_SSL_PATH = '/opt/ssl/amqp.pem';
const ETCD_SSL_PATH = '/opt/ssl/etcd.pem';

let amqp = null;
let etcd = null;

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
