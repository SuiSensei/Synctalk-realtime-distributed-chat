// TODO: import your Redis client/publisher/subscriber from redis.ts
// e.g. import { publisher, subscriber, publishMessage } from "../../redis";

describe("Redis pub/sub", () => {
  beforeAll(async () => {
    // TODO: connect to a test Redis instance (use a separate DB index or docker container)
  });

  afterAll(async () => {
    // TODO: disconnect publisher and subscriber clients
  });

  afterEach(async () => {
    // TODO: flush test keys to keep tests isolated
    // e.g. await publisher.flushDb()
  });

  describe("publishMessage", () => {
    it("should publish a message to the correct channel", (done) => {
      // TODO:
      // 1. Subscribe to 'room:test-room'
      // 2. Call publishMessage('test-room', payload)
      // 3. Assert subscriber receives the payload
      done();
    });

    it("should serialize the payload as JSON", (done) => {
      // TODO: assert the received message can be JSON.parsed back to original payload
      done();
    });
  });

  describe("subscriber", () => {
    it("should receive messages only on the subscribed channel", (done) => {
      // TODO:
      // 1. Subscribe to 'room:A'
      // 2. Publish to 'room:B'
      // 3. Assert no message is received on 'room:A'
      done();
    });

    it("should handle multiple subscribers on the same channel", (done) => {
      // TODO: two subscribers on the same channel both receive the published message
      done();
    });
  });

  describe("connection resilience", () => {
    it("should reconnect after a dropped connection", async () => {
      // TODO: simulate a disconnect, assert reconnect happens without manual intervention
    });
  });
});