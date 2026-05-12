# SyncTalk-realtime-distributed-chat

SyncTalk is a real-time chat application designed to demonstrate how multiple users can communicate instantly using distributed system concepts. It uses WebSocket-based communication backed by Redis and Supabase to allow seamless, scalable message exchange between clients.

## Architecture

![Architecture](docs/architecture.md)

- **Frontend**: Next.js + React + Tailwind + Lucide
- **Backend**: Node.js + WebSocket + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Cache/PubSub**: Redis (Upstash)

## Getting Started

1. Set up Supabase and Upstash Redis.
2. Configure `.env.local` in `frontend/` and `.env` in `websocket/`.
3. Start the backend: `cd websocket && npm run dev`.
4. Start the frontend: `cd frontend && npm run dev`.

For detailed instructions, see [Integration Guide](docs/integration-guide.md).

## Documentation
- [Architecture](docs/architecture.md)
- [Integration Guide](docs/integration-guide.md)
- [Handover Checklist](docs/handover-checklist.md)
- [Technical Debt](docs/tech-debt.md)
