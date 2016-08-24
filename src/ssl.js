// @flow

import fs from 'fs';

import logger from './logger';

import {
  AMQP_PEM,
  ETCD_PEM
} from './environment';

let amqp = AMQP_PEM;
let etcd = ETCD_PEM;

const AMQP_SSL_PATH: string = '/opt/ssl/amqp.pem';
const ETCD_SSL_PATH: string = '/opt/ssl/etcd.pem';

if (!amqp) {
  try {
    amqp = fs.readFileSync(AMQP_SSL_PATH);
    logger.info('using ssl for amqp');
  } catch (e) {
    logger.info('not using ssl for amqp');
  }
}

if (!etcd) {
  try {
    etcd = fs.readFileSync(ETCD_SSL_PATH);
    logger.info('using ssl for etcd');
  } catch (e) {
    logger.info('not using ssl for etcd');
  }
}

export {
  amqp,
  etcd
};
