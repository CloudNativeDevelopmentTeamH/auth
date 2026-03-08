/**
 * Bootstrap script for local development.
 *
 * Declares the RabbitMQ topology (exchange + queue + binding) so that
 * messages are not lost when running without the email service.
 *
 * Run: npm run setup:rabbitmq
 */

import amqplib from 'amqplib';
import config from '../utils/config.ts';
import { USER_REGISTERED, USER_EVENTS_EXCHANGE} from '../../usecases/events/events.ts';

const EXCHANGE      = USER_EVENTS_EXCHANGE;
const EXCHANGE_TYPE = 'topic';
const QUEUE         = `${USER_REGISTERED}.dev`;
const ROUTING_KEY   = USER_REGISTERED;

async function setup(): Promise<void> {
  const url = config.rabbitmq.url;
  console.log(`Connecting to RabbitMQ at ${url.replace(/:[^:@]+@/, ':***@')} …`);

  const connection = await amqplib.connect(url);
  const channel    = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: true });
  console.log(`✓ Exchange  "${EXCHANGE}" (${EXCHANGE_TYPE}, durable)`);

  await channel.assertQueue(QUEUE, { durable: true });
  console.log(`✓ Queue     "${QUEUE}" (durable)`);

  await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
  console.log(`✓ Binding   "${QUEUE}" ← "${EXCHANGE}" [${ROUTING_KEY}]`);

  await channel.close();
  await connection.close();

  console.log('\nRabbitMQ topology ready for local development.');
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
