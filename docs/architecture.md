# SyncTalk Architecture

## Overview
SyncTalk is a real-time, distributed chat application. The architecture is composed of three main layers:
1. **Frontend (Next.js)**: React-based UI, connecting to Supabase for Auth and WebSocket Server for real-time messaging.
2. **WebSocket Server (Node.js/TypeScript)**: Handles ephemeral connections, message broadcasting, presence, and rate limiting.
3. **Storage & State**:
   - **Supabase (PostgreSQL)**: Source of truth for users, profiles, rooms, messages, and reactions.
   - **Redis (Upstash)**: Distributed cache for presence, typing indicators, room member lists, rate limiting, and pub/sub.

## Data Flow
- **Authentication**: Frontend authenticates with Supabase, retrieves a JWT. The WS server validates the JWT upon connection.
- **Messages**:
  1. Frontend sends `chat` WS event.
  2. Server verifies rate limits via Redis.
  3. Server persists message to Supabase.
  4. Server caches message history in Redis.
  5. Server broadcasts message to all active clients in the room via WS.
- **Presence**: Clients send status. Server stores it in Redis with TTL and broadcasts `presence` updates.

## Component Boundaries
- **WebSocket Handlers**: Separated by domain (`auth`, `chat`, `room`, `typing`, `query`).
- **Hooks**: Frontend domain hooks (`useChat`, `useRooms`, `usePresence`) wrap a singleton `WebSocketContext`.
