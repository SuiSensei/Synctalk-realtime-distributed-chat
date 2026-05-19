import WebSocket from "ws";

// TODO: import your server start/stop utilities
// e.g. import { startServer, stopServer } from "../../server";

const WS_URL = "ws://localhost:8080";

describe("WebSocket server", () => {
  let server: any; // TODO: type this with your actual server type

  beforeAll(async () => {
    // TODO: start the server before all tests
    // server = await startServer();
  });

  afterAll(async () => {
    // TODO: stop the server after all tests
    // await stopServer(server);
  });

  describe("connection", () => {
    it("should accept a WebSocket connection", (done) => {
      const client = new WebSocket(WS_URL);
      client.on("open", () => {
        // TODO: assert connection is open
        client.close();
        done();
      });
      client.on("error", done);
    });

    it("should reject a connection without a valid session token", (done) => {
      // TODO: connect without auth header/token, assert server closes with 401 or similar
      done();
    });
  });

  describe("message broadcast", () => {
    it("should broadcast a message from one client to all others in the same room", (done) => {
      // TODO:
      // 1. Connect clientA and clientB, both join 'room-1'
      // 2. clientA sends a message
      // 3. Assert clientB receives the same message
      done();
    });

    it("should not deliver a message to clients in a different room", (done) => {
      // TODO:
      // 1. clientA joins room-1, clientB joins room-2
      // 2. clientA sends a message
      // 3. Assert clientB does NOT receive it
      done();
    });
  });

  describe("disconnect", () => {
    it("should clean up the client from the connection pool on disconnect", (done) => {
      // TODO:
      // 1. Connect a client
      // 2. Close the connection
      // 3. Assert the server's state no longer contains the client
      done();
    });
  });
});