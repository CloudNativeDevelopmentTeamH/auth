export default interface EventPublisher {
  publish<T extends object>(routingKey: string, event: T): Promise<void>;
}