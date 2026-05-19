import {
  // TODO: import config values or the config loader from config.ts
  // e.g. config, PORT, ALLOWED_ORIGINS, etc.
} from "../../config";

describe("config", () => {
  describe("PORT", () => {
    it("should default to 8080 when PORT env variable is not set", () => {
      // TODO: delete process.env.PORT, re-import config, assert port === 8080
    });

    it("should use the value from the PORT environment variable when set", () => {
      // TODO: set process.env.PORT = '9090', re-import, assert port === 9090
    });
  });

  describe("ALLOWED_ORIGINS", () => {
    it("should be a non-empty array", () => {
      // TODO: assert Array.isArray(ALLOWED_ORIGINS) && length > 0
    });
  });

  describe("environment validation", () => {
    it("should throw if a required env variable is missing", () => {
      // TODO: remove a required env var (e.g. SUPABASE_URL) and assert config throws
    });
  });
});