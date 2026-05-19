import {
  // TODO: import state management functions from state.ts
  // e.g. addClient, removeClient, getClientsInRoom, broadcastToRoom, etc.
} from "../../state";

describe("state", () => {
  beforeEach(() => {
    // TODO: reset state before each test
    // e.g. clearAllClients() or re-initialize the state store
  });

  describe("addClient", () => {
    it("should register a new client with a unique ID", () => {
      // TODO: call addClient(mockSocket, 'user-1') and assert it is in state
    });

    it("should not add the same client twice", () => {
      // TODO: call addClient twice with the same ID and assert count stays 1
    });
  });

  describe("removeClient", () => {
    it("should remove a client from the active pool", () => {
      // TODO: add then remove a client, assert it no longer exists in state
    });

    it("should do nothing when removing a client that does not exist", () => {
      // TODO: call removeClient('nonexistent-id') and assert no error is thrown
    });
  });

  describe("getClientsInRoom", () => {
    it("should return only clients that have joined the given room", () => {
      // TODO: add 2 clients to room-A and 1 to room-B, assert getClientsInRoom('room-A').length === 2
    });

    it("should return an empty array for a room with no clients", () => {
      // TODO: assert getClientsInRoom('empty-room') deep equals []
    });
  });

  describe("broadcastToRoom", () => {
    it("should call send() on every client in the room", () => {
      // TODO: mock socket.send, call broadcastToRoom, assert send was called N times
    });

    it("should not send to clients outside the target room", () => {
      // TODO: add client to different room, assert their send() was NOT called
    });

    it("should optionally exclude the sender", () => {
      // TODO: pass excludeId option and assert that client's send() was skipped
    });
  });
});