import {
  // TODO: import the actual functions from helpers.ts
  // e.g. formatMessage, validatePayload, sanitizeInput, etc.
} from "../../helpers";

describe("helpers", () => {
  describe("formatMessage", () => {
    it("should return a message object with type, username, content, and timestamp", () => {
      // TODO: call formatMessage() with sample args and assert shape
    });

    it("should include a valid ISO timestamp", () => {
      // TODO: assert that the returned timestamp is a valid ISO 8601 string
    });
  });

  describe("validatePayload", () => {
    it("should return true for a well-formed message payload", () => {
      // TODO: pass a valid payload and assert true
    });

    it("should return false when 'type' field is missing", () => {
      // TODO: pass a payload without 'type' and assert false
    });

    it("should return false when 'content' is an empty string", () => {
      // TODO: pass an empty content string and assert false
    });

    it("should return false for a non-object payload", () => {
      // TODO: pass null/undefined/string and assert false
    });
  });

  describe("sanitizeInput", () => {
    it("should strip HTML tags from user input", () => {
      // TODO: pass '<script>alert(1)</script>' and assert plain text is returned
    });

    it("should trim leading and trailing whitespace", () => {
      // TODO: pass '  hello  ' and assert 'hello'
    });
  });
});