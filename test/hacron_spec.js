import { expect } from 'chai';
import amqplib from 'amqplib';
import EventEmitter from 'events';

import { isString, isNumber } from 'underscore';

import {
  bufferToObject
} from '../src/amqp';

import {
  EXCHANGE_DURABLE,
  EXCHANGE_NAME,
  AMQP_URL
} from '../src/environment';

import request from 'supertest-as-promised';

const QUEUE_NAME = 'hacron_test';

describe('hacron', () => {
  let channel = null
    , emitter = null;
  before(async () => {
    const connection = await amqplib.connect(AMQP_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'fanout', {
      durable: EXCHANGE_DURABLE
    });

    await channel.assertQueue(QUEUE_NAME);
    
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'hacron.tick');

    emitter = new EventEmitter();

    await channel.consume(QUEUE_NAME, async (message) => {
      try {
        await channel.ack(message);
        const m = bufferToObject(message.content);
        emitter.emit('tick', m);
      } catch (e) {
        console.trace(e);
      }
    });
  });
  describe('monitor', () => {
    it('returns process stats', async () => {
      const { body: data } = await request(`http://localhost:${process.env.MONITOR_PORT}`)
      .get('/monitor')
      .expect(200);

      expect(isNaN(data.memory.rss)).to.be.false;
      expect(isNaN(data.memory.heapUsed)).to.be.false;
      expect(isNaN(data.memory.heapTotal)).to.be.false;
    });
  });
  describe('tick', () => {
    let message = null;
    before((done) => {
      function onTick (m) {
        message = m;
        emitter.removeListener('tick', onTick);
        done();
      };
      emitter.on('tick', onTick);
    });
    describe('message', () => {
      it('contains an id of type String', () => {
        expect(isString(message.id)).to.be.true;
      });
      it('contains a minute of type Number', () => {
        expect(isNumber(message.minute)).to.be.true;
      });
      it('contains an hour of type Number', () => {
        expect(isNumber(message.hour)).to.be.true;
      });
      it('contains a day_of_month of type Number', () => {
        expect(isNumber(message.day_of_month)).to.be.true;
      });
      it('contains a day_of_week of type Number', () => {
        expect(isNumber(message.day_of_week)).to.be.true;
      });
      it('contains a month of type Number', () => {
        expect(isNumber(message.month)).to.be.true;
      });
      it('contains a year of type Number', () => {
        expect(isNumber(message.year)).to.be.true;
      });
      it('contains an iso of type String', () => {
        expect(isString(message.iso)).to.be.true;
      });
      it('contains a timestamp of type Number', () => {
        expect(isNumber(message.timestamp)).to.be.true;
      });
      it('contains a timezone_offset of type Number', () => {
        expect(isNumber(message.timezone_offset)).to.be.true;
      });
    });
  });
});
