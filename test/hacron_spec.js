import { expect } from 'chai';
import amqplib from 'amqplib';

import request from 'supertest-as-promised';

const AMQP_URL = process.env.AMQP_URL;
const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
const CHANNEL_NAME = 'hacron_test';

describe('hacron', () => {
  let channel = null;
  before(async () => {
    const connection = await amqplib.connect(AMQP_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(CHANNEL_NAME);
    await channel.bindQueue(CHANNEL_NAME, EXCHANGE_NAME, '');
  });
  describe('monitor', () => {
    it('returns process stats', async () => {
      const { data } = await request('http://localhost:8080')
      .get('/monitor')
      .expect(200);

      expect(isNaN(data.memory.rss)).to.be.false;
      expect(isNaN(data.memory.heapUsed)).to.be.false;
      expect(isNaN(data.memory.heapTotal)).to.be.false;
    });
  });
  describe('tick', () => {
    let m = null
      , num = 0;
    it('is dispatched once per minute', () => {

    });
    describe('message', () => {
      it('contains a uuid', () => {

      });
      it('contains a minute', () => {

      });
      it('contains an hour', () => {

      });
      it('contains a day_of_month', () => {

      });
      it('contains a day_of_week', () => {

      });
      it('contains a month', () => {

      });
      it('contains a year', () => {

      });
      it('contains an iso date', () => {

      });
      it('contains a timezone_offset', () => {

      });
    });
  });
});
