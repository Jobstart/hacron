import fs from 'fs';
import debug from 'debug';

const log = debug('hacron:ssl');

const AMQP_SSL_PATH = '/opt/ssl/amqp.pem';
const ETCD_SSL_PATH = '/opt/ssl/etcd.pem';

let amqp = null;
let etcd = null;

try {
  amqp = fs.readFileSync(AMQP_SSL_PATH);
  log('using ssl for amqp');
} catch (e) {
  log('not using ssl for amqp');
};

try {
  etcd = fs.readFileSync(ETCD_SSL_PATH);
  log('using ssl for etcd');
} catch (e) {
  log('not using ssl for etcd');
};


export {
  amqp,
  etcd
};
