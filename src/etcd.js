import Etcd from 'node-etcd';

import { etcd as etcdCa } from './ssl';
import { ETCD_URLS } from './environment';

const options = etcdCa ? {
  ca: etcdCa
} : {};


const etcd = new Etcd(ETCD_URLS, options);

export default etcd;
