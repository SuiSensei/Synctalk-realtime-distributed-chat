import Redis from "ioredis";
import { config } from "./config";

/**
 * Redis client for caching, pub/sub, and rate limiting.
 * Auto-enables TLS for Upstash hosts.
 */
const redisOptions: any = {};
if (config.redisUrl.includes("upstash.io")) {
  redisOptions.tls = {};
}

export const redis = new Redis(config.redisUrl, redisOptions);

// Dedicated pub/sub connections (subscribers can't run other commands)
export const redisPub = new Redis(config.redisUrl, redisOptions);
export const redisSub = new Redis(config.redisUrl, redisOptions);

redis.on("connect", () => console.log("🔴 Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err.message));

// ─── Key Patterns ────────────────────────────────────────────────────────────
// All keys are documented here for easy reference.
//
//   presence:{userId}         → JSON user profile        TTL: 120s (heartbeat refresh)
//   typing:{roomId}:{userId}  → username string          TTL: 5s   (auto-expire)
//   messages:{roomId}:recent  → JSON message array       TTL: 300s (5 min cache)
//   room_members:{roomId}     → JSON user_id array       TTL: 60s
//   ratelimit:{userId}:msg    → counter                  TTL: 60s  (sliding window)
//   channel:room:{roomId}     → pub/sub channel          (no TTL)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Cache Helpers ───────────────────────────────────────────────────────────

/** Cache a value with TTL. */
export async function cacheSet(key: string, value: any, ttlSeconds: number): Promise<void> {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

/** Get a cached value, returns null on miss. */
export async function cacheGet<T = any>(key: string): Promise<T | null> {
  const raw = await redis.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Delete a cached key. */
export async function cacheDel(key: string): Promise<void> {
  await redis.del(key);
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────

/**
 * Check if a user has exceeded the rate limit for an action.
 * Uses a sliding window counter in Redis.
 *
 * @returns true if the request should be BLOCKED (rate exceeded)
 */
export async function isRateLimited(
  userId: string,
  action: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const key = `ratelimit:${userId}:${action}`;
  const current = await redis.incr(key);

  if (current === 1) {
    // First request in window — set expiry
    await redis.expire(key, windowSeconds);
  }

  return current > maxRequests;
}

// ─── Presence ────────────────────────────────────────────────────────────────

/** Mark a user as online in Redis with TTL. */
export async function setPresence(userId: string, profileData: any): Promise<void> {
  await cacheSet(`presence:${userId}`, profileData, 120);
}

/** Remove a user's presence from Redis. */
export async function clearPresence(userId: string): Promise<void> {
  await cacheDel(`presence:${userId}`);
}

/** Get all online user IDs from Redis presence keys. */
export async function getOnlineUserIds(): Promise<string[]> {
  const keys = await redis.keys("presence:*");
  return keys.map((k) => k.replace("presence:", ""));
}

// ─── Typing ──────────────────────────────────────────────────────────────────

/** Set a user as typing in a room (auto-expires in 5s). */
export async function setTyping(roomId: string, userId: string, username: string): Promise<void> {
  await redis.set(`typing:${roomId}:${userId}`, username, "EX", 5);
}

/** Clear a user's typing indicator. */
export async function clearTyping(roomId: string, userId: string): Promise<void> {
  await redis.del(`typing:${roomId}:${userId}`);
}

/** Get all users currently typing in a room. */
export async function getTypingUsers(roomId: string): Promise<{ userId: string; username: string }[]> {
  const keys = await redis.keys(`typing:${roomId}:*`);
  if (keys.length === 0) return [];

  const values = await redis.mget(keys);
  return keys.map((key, i) => ({
    userId: key.split(":").pop()!,
    username: values[i] || "Unknown",
  }));
}

// ─── Room Member Cache ───────────────────────────────────────────────────────

/** Cache room member IDs (60s TTL). */
export async function cacheRoomMembers(roomId: string, memberIds: string[]): Promise<void> {
  await cacheSet(`room_members:${roomId}`, memberIds, 60);
}

/** Get cached room member IDs, or null on miss. */
export async function getCachedRoomMembers(roomId: string): Promise<string[] | null> {
  return cacheGet<string[]>(`room_members:${roomId}`);
}

/** Invalidate room member cache (call on join/leave). */
export async function invalidateRoomMembers(roomId: string): Promise<void> {
  await cacheDel(`room_members:${roomId}`);
}

// ─── Message Cache ───────────────────────────────────────────────────────────

/** Cache recent messages for a room (5 min TTL). */
export async function cacheMessages(roomId: string, messages: any[]): Promise<void> {
  await cacheSet(`messages:${roomId}:recent`, messages, 300);
}

/** Get cached messages for a room, or null on miss. */
export async function getCachedMessages(roomId: string): Promise<any[] | null> {
  return cacheGet<any[]>(`messages:${roomId}:recent`);
}

/** Invalidate message cache for a room (call on new message). */
export async function invalidateMessages(roomId: string): Promise<void> {
  await cacheDel(`messages:${roomId}:recent`);
}
