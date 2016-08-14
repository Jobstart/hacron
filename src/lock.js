import { hostname } from 'os';
import Microlock from 'microlock';

import {
  LOCK_KEY
} from './environment';

import etcd from './etcd';

const id = hostname();
const ttl = 10;

const lock = new Microlock(etcd, LOCK_KEY, id, ttl);

export default lock;
