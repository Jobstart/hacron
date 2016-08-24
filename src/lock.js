// @flow

import { hostname } from 'os';
import Microlock from 'microlock';

import {
  LOCK_KEY
} from './environment';

import etcd from './etcd';

const id: string = hostname();
const ttl: number = 10;

const lock: Microlock = new Microlock(etcd, LOCK_KEY, id, ttl);

export default lock;
