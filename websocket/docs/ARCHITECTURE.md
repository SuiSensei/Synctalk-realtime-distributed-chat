# Architecture Guide

## Overview

The WebSocket server acts as the real-time communication layer between the Next.js frontend and the Supabase PostgreSQL database.

```
Frontend (Next.js)
    │
    ├── Supabase Auth (login → access token)
    │
    ↕ WebSocket (ws://host:port/?token=ACCESS_TOKEN)
    │
WebSocket Server (this package)
    │
    ├── src/server.ts ─── Entry point, Express + WS + auth + router + rate limiting
    ├── src/config.ts ─── Env var validation
    ├── src/supabase.ts ── Supabase service-role client
    ├── src/redis.ts ───── Redis client, cache helpers, rate limiter, pub/sub
    ├── src/types.ts ───── TypeScript interfaces
    ├── src/state.ts ───── In-memory maps (connections only)
    ├── src/helpers.ts ─── Broadcast + presence (Redis-cached) + DM room helper
    └── src/handlers/ ──── One file per feature
    │
    ├──── ↕ Redis (Upstash) ── Caching, rate limiting, typing TTL, pub/sub
    │
    └──── ↕ Supabase JS Client (service-role) ── Persistence
    │
Supabase PostgreSQL
    └── Tables: profile, room, room_member, message,
                direct_message, message_reaction, message_read,
                user_status, friends, gender, social_link,
                message_attachment
```

## Module Responsibilities

| Module | Responsibility |
|:-------|:---------------|
| `config.ts` | Loads `.env`, validates required vars (incl. `REDIS_URL`), exports typed config object |
| `supabase.ts` | Creates and exports a single Supabase client (service-role key) |
| `redis.ts` | Redis client (ioredis), cache helpers, rate limiter, presence/typing/message cache, pub/sub connections |
| `types.ts` | All TypeScript interfaces: `UserProfile`, `ConnectedUser`, all message payloads |
| `state.ts` | Exports `connections` Map (in-memory, lost on restart) |
| `helpers.ts` | `sendToUser()`, `broadcastToRoom()` (Redis-cached members), `broadcastPresence()` (syncs to Redis), `getOrCreateDmRoom()` |
| `server.ts` | Express setup, HTTP→WS upgrade with JWT auth, connection lifecycle, rate-limited message routing |

## Handler Modules

| Handler | File | Message Types | Persists To |
|:--------|:-----|:--------------|:------------|
| Group chat | `handlers/chat.ts` | `chat` | `message` + invalidates Redis cache |
| Direct message | `handlers/direct-message.ts` | `direct_message` | `message`, `direct_message`, `room`, `room_member` |
| Typing | `handlers/typing.ts` | `typing`, `stopped_typing` | Redis only (5s TTL auto-expire) |
| Room CRUD | `handlers/room.ts` | `create_room`, `join_room`, `leave_room` | `room`, `room_member` + invalidates Redis member cache |
| Reactions | `handlers/reaction.ts` | `add_reaction`, `remove_reaction` | `message_reaction` |
| Read receipts | `handlers/read-receipt.ts` | `mark_as_read` | `message_read` |
| Status | `handlers/status.ts` | `update_status` | `profile`, `user_status` |
| Profile | `handlers/profile.ts` | `update_profile` | `profile` |
| Queries | `handlers/query.ts` | `get_rooms`, `get_messages` | _(read-only, Redis-cached)_ |

## Data Flow: Sending a Chat Message

```
1. Client sends:  { "type": "chat", "roomId": "abc", "text": "Hello" }
2. server.ts checks rate limit via Redis INCR (30 msg/min)
3. server.ts routes to handlers/chat.ts → handleChat()
4. handleChat() verifies room membership via Supabase
5. handleChat() inserts into `message` table via Supabase
6. handleChat() invalidates Redis message cache for the room
7. handleChat() calls broadcastToRoom() from helpers.ts
8. broadcastToRoom() gets member IDs (Redis cache → Supabase fallback)
9. broadcastToRoom() sends the message to each connected member's WebSocket
```

## What Lives In-Memory vs Database

| Data | Storage | Why |
|:-----|:--------|:----|
| Active WS connections | In-memory (`state.ts`) | WebSocket objects can't be serialized |
| Typing indicators | **Redis** (`typing:{roomId}:{userId}`, 5s TTL) | Ephemeral, auto-expires, survives handler restarts |
| Room member lists | **Redis cache** (60s TTL) → Supabase | Avoid repeated DB queries on every broadcast |
| Recent messages | **Redis cache** (5 min TTL) → Supabase | Fast repeated loads of the same room |
| Rate limit counters | **Redis** (`ratelimit:{userId}:msg`, 60s) | Sliding window, atomic INCR |
| User presence | **Redis** (120s TTL) + Supabase + in-memory | Fast lookup + durability + broadcast |
| Messages | Supabase (`message`) | Must persist across restarts |
| Rooms & members | Supabase (`room`, `room_member`) | Must persist |
| Reactions | Supabase (`message_reaction`) | Must persist |
| Read receipts | Supabase (`message_read`) | Must persist |

## Adding a New Handler

1. Create `src/handlers/your-feature.ts`
2. Define the handler function: `export async function handleYourFeature(userId, profile, data)`
3. Use `supabase` from `../supabase` for DB operations
4. Use `sendToUser` / `broadcastToRoom` from `../helpers` for messaging
5. Import and add a `case` in the switch block in `src/server.ts`
6. Add the payload type to `src/types.ts`
7. Document the message format in `docs/PROTOCOL.md`
