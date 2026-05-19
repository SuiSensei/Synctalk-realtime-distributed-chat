// TODO: import the message handler from handlers/
// e.g. import { handleMessage } from "../../handlers/messageHandler";

describe("handleMessage", () => {
  let mockSocket: any;
  let mockState: any;

  beforeEach(() => {
    // TODO: create a mock WebSocket and mock state
    mockSocket = {
      send: jest.fn(),
      readyState: 1, // WebSocket.OPEN
    };
    mockState = {
      getClientsInRoom: jest.fn().mockReturnValue([]),
      saveMessage: jest.fn(),
    };
  });

  it("should broadcast the message to all clients in the same room", async () => {
    // TODO:
    // 1. Set up two mock clients in the same room via mockState
    // 2. Call handleMessage(mockSocket, payload, mockState)
    // 3. Assert both clients' send() were called with the message
  });

  it("should persist the message via supabase before broadcasting", async () => {
    // TODO: assert mockState.saveMessage was called before any socket.send
  });

  it("should not broadcast if the message payload is invalid", async () => {
    // TODO: pass an invalid payload and assert socket.send is never called
  });

  it("should handle errors from saveMessage without crashing", async () => {
    // TODO: make mockState.saveMessage throw, assert the handler catches it gracefully
  });
});