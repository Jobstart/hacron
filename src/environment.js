export const MONITOR_PORT = process.env.MONITOR_PORT || 80;
export const AMQP_URL = process.env.RABBIT_URL || 'amqp://localhost:5672//';
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME || 'hacron';
export const ETCD_URLS = (process.env.ETCD_URLS || '').replace(/ /g,'').split(',');
export const LOCK_KEY = process.env.LOCK_KEY || '/locks/hacron';
export const CRON_TIME = process.env.CRON_TIME || '*/1 * * * *'; //every minute
