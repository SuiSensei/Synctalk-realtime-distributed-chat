// TODO: import the room handlers from handlers/
// e.g. import { handleJoinRoom, handleLeaveRoom } from "../../handlers/roomHandler";

describe("handleJoinRoom", () => {
  let mockSocket: any;
  let mockState: any;

  beforeEach(() => {
    mockSocket = { send: jest.fn(), readyState: 1 };
    mockState = {
      addClientToRoom: jest.fn(),
      getClientsInRoom: jest.fn().mockReturnValue([]),
    };
  });

  it("should add the client to the requested room", async () => {
    // TODO:
    // 1. Call handleJoinRoom(mockSocket, { roomId: 'room-1', userId: 'u1' }, mockState)
    // 2. Assert mockState.addClientToRoom was called with the correct args
  });

  it("should send a confirmation event back to the joining client", async () => {
    // TODO: assert mockSocket.send was called with a 'joined_room' type payload
  });

  it("should notify existing room members of the new join", async () => {
    // TODO: mock existing clients, assert they each received a 'user_joined' event
  });
});

describe("handleLeaveRoom", () => {
  let mockSocket: any;
  let mockState: any;

  beforeEach(() => {
    mockSocket = { send: jest.fn(), readyState: 1 };
    mockState = {
      removeClientFromRoom: jest.fn(),
      getClientsInRoom: jest.fn().mockReturnValue([]),
    };
  });

  it("should remove the client from the room", async () => {
    // TODO: assert mockState.removeClientFromRoom was called
  });

  it("should notify remaining members that the user left", async () => {
    // TODO: assert remaining clients received a 'user_left' event
  });

  it("should do nothing if the client was not in the room", async () => {
    // TODO: call handleLeaveRoom for a room the client never joined, assert no error
  });
});