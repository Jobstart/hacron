// @flow

import Etcd from 'node-etcd';

import { etcd as etcdCa } from './ssl';
import { ETCD_URLS } from './environment';

const options: Object = etcdCa ? {
  ca: etcdCa
} : {};


const etcd: Etcd = new Etcd(ETCD_URLS, options);

export default etcd;
