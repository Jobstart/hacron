// @flow

export const MONITOR_PORT: number = process.env.MONITOR_PORT ? parseInt(process.env.MONITOR_PORT) : 80;
export const AMQP_URL: string = process.env.AMQP_URL || 'amqp://localhost:5672//';
export const ETCD_URLS: Array<string> = (process.env.ETCD_URLS || '').replace(/ /g,'').split(',');
export const EXCHANGE_NAME: string = process.env.EXCHANGE_NAME || 'hacron';
export const LOCK_KEY: string = process.env.LOCK_KEY || '/locks/hacron';
export const CRON_TIME: string = process.env.CRON_TIME || '*/1 * * * *'; //every minute
export const EXCHANGE_DURABLE: boolean = process.env.EXCHANGE_DURABLE !== undefined;
