# SyncTalk WebSocket Server

Real-time distributed chat backend. Authenticates via Supabase JWT, persists all data to Supabase PostgreSQL, and uses in-memory state only for active connections and typing indicators.

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure (copy and fill in values)
cp .env.example .env

# 3. Run (development)
npm run dev

# 4. Build (production)
npm run build && npm start
```

Server starts at: `ws://localhost:8000`  
Health check: `GET http://localhost:8000/health`

## Project Structure

```
websocket/
├── src/
│   ├── server.ts           # Entry point — Express + WS + auth + router
│   ├── config.ts           # Environment variable validation
│   ├── supabase.ts         # Supabase service-role client singleton
│   ├── types.ts            # All TypeScript interfaces
│   ├── state.ts            # In-memory maps (connections, typing)
│   ├── helpers.ts          # Broadcast, presence, DM room helpers
│   └── handlers/
│       ├── chat.ts         # Group chat messages
│       ├── direct-message.ts # Direct messages with DM room resolution
│       ├── typing.ts       # Typing indicators (ephemeral)
│       ├── room.ts         # Room create / join / leave
│       ├── reaction.ts     # Add / remove emoji reactions
│       ├── read-receipt.ts # Mark messages as read
│       ├── status.ts       # Online status updates
│       ├── profile.ts      # Profile field updates
│       └── query.ts        # Get rooms list, get messages (paginated)
├── docs/
│   ├── PROTOCOL.md         # WebSocket message protocol reference
│   ├── ARCHITECTURE.md     # Module architecture & data flow
│   └── SETUP.md            # Full developer setup guide
├── .env.example            # Environment variable template
├── package.json
└── tsconfig.json
```

## Environment Variables

| Variable | Required | Description |
|:---------|:---------|:------------|
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server-side only) |
| `REDIS_URL` | ❌ | Redis connection string (Phase 3) |
| `PORT` | ❌ | Server port (default: 8000) |

## Connection Flow

1. Frontend obtains a Supabase access token via `supabase.auth.getSession()`
2. Frontend opens: `ws://localhost:8000/?token=ACCESS_TOKEN`
3. Server validates the token via `supabase.auth.getUser(token)`
4. Server fetches the user's `profile` row from the database
5. On success, the connection is established and an `auth_success` message is sent

## Documentation

- **[Protocol Reference](docs/PROTOCOL.md)** — All message types and payloads
- **[Architecture Guide](docs/ARCHITECTURE.md)** — Module structure and data flow
- **[Setup Guide](docs/SETUP.md)** — Step-by-step development setup
- **[Database Schema](../docs/database-schema.sql)** — Full Supabase table definitions
