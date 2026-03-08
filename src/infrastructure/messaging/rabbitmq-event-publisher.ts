import amqplib, { type Channel, type ChannelModel } from 'amqplib';
import type EventPublisher from '../../usecases/ports/outbound/event-publisher.ts';
import config from '../utils/config.ts';
import { USER_EVENTS_EXCHANGE } from '../../usecases/events/events.ts';

export default class RabbitMqEventPublisher implements EventPublisher {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  private async getChannel(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }
    this.connection = await amqplib.connect(config.rabbitmq.url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(
      USER_EVENTS_EXCHANGE,
      'topic',
      { durable: true }
    );
    return this.channel;
  }

  async publish<T extends object>(routingKey: string, event: T): Promise<void> {
    const channel = await this.getChannel();
    const content = Buffer.from(JSON.stringify(event));

    channel.publish(
      USER_EVENTS_EXCHANGE,
      routingKey,
      content,
      { persistent: true, contentType: 'application/json' }
    );
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }
}
