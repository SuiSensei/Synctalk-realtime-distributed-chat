// TODO: import your Supabase helper functions from supabase.ts
// e.g. import { saveMessage, getMessageHistory, authenticateUser } from "../../supabase";

describe("Supabase integration", () => {
  beforeAll(async () => {
    // TODO: point to a test Supabase project or a local Supabase instance
    // Consider using environment variable SUPABASE_URL_TEST
  });

  afterEach(async () => {
    // TODO: clean up test rows inserted during each test
    // e.g. await supabase.from('messages').delete().eq('room_id', 'test-room')
  });

  describe("saveMessage", () => {
    it("should insert a message record into the database", async () => {
      // TODO:
      // 1. Call saveMessage({ roomId, userId, content })
      // 2. Query the DB and assert the row exists
    });

    it("should return the saved message with a generated ID and timestamp", async () => {
      // TODO: assert returned object has 'id' and 'created_at' fields
    });

    it("should throw when required fields are missing", async () => {
      // TODO: call saveMessage({}) and assert it rejects or throws
    });
  });

  describe("getMessageHistory", () => {
    it("should return messages for a given room in ascending time order", async () => {
      // TODO:
      // 1. Insert 3 messages with different timestamps
      // 2. Call getMessageHistory('test-room')
      // 3. Assert returned array is sorted oldest → newest
    });

    it("should return an empty array for a room with no messages", async () => {
      // TODO: assert getMessageHistory('empty-room') deep equals []
    });

    it("should respect the limit parameter", async () => {
      // TODO: insert 20 messages, call getMessageHistory('room', { limit: 10 }), assert length === 10
    });
  });

  describe("authenticateUser", () => {
    it("should return a user object for a valid session token", async () => {
      // TODO: use a seeded test user's token and assert the user object is returned
    });

    it("should return null for an expired or invalid token", async () => {
      // TODO: pass a garbage token and assert null is returned
    });
  });
});