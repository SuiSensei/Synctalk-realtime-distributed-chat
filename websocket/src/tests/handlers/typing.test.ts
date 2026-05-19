// TODO: import the typing handler from handlers/
// e.g. import { handleTyping } from "../../handlers/typingHandler";

describe("handleTyping", () => {
  let mockSocket: any;
  let mockState: any;

  beforeEach(() => {
    mockSocket = { send: jest.fn(), readyState: 1 };
    mockState = {
      getClientsInRoom: jest.fn().mockReturnValue([]),
    };
  });

  it("should relay a 'typing' event to all other clients in the room", async () => {
    // TODO:
    // 1. Set up mock peer clients in the room
    // 2. Call handleTyping(mockSocket, { roomId, userId, isTyping: true }, mockState)
    // 3. Assert all peers received a typing event
  });

  it("should not send the typing event back to the sender", async () => {
    // TODO: assert mockSocket.send was NOT called (sender shouldn't get their own typing event)
  });

  it("should relay a 'stopped typing' event when isTyping is false", async () => {
    // TODO: call with isTyping: false and assert event type reflects stopped typing
  });

  it("should not relay if the client is not in any room", async () => {
    // TODO: mockState.getClientsInRoom returns [], assert no send calls happen
  });
});