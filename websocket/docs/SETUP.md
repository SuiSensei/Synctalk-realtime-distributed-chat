# Setup Guide

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Supabase** project with the database schema applied (see `docs/database-schema.sql`)
- _(Optional, Phase 3)_ A Redis instance (e.g., Upstash)

## 1. Install Dependencies

```bash
cd websocket
npm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
PORT=8000
```

> ⚠️ The **service role key** is found in your Supabase dashboard under Settings → API → `service_role` (secret). Never expose this to the frontend.

## 3. Run in Development

```bash
npm run dev
```

This uses `nodemon` + `ts-node` for hot-reloading. The server will restart on any `.ts` or `.json` file change.

Expected output:
```
🚀 SyncTalk WS server listening on port 8000
```

## 4. Build for Production

```bash
npm run build   # Compiles TypeScript to dist/
npm start       # Runs compiled JS
```

## 5. Test the Connection

### Using a browser console:

```javascript
const token = "YOUR_SUPABASE_ACCESS_TOKEN";
const ws = new WebSocket(`ws://localhost:8000/?token=${token}`);

ws.onopen = () => console.log("Connected!");
ws.onmessage = (e) => console.log("Received:", JSON.parse(e.data));
ws.onerror = (e) => console.error("Error:", e);
```

On success you'll receive:
```json
{ "type": "auth_success", "userId": "...", "profile": { ... } }
```

### Using the health endpoint:

```bash
curl http://localhost:8000/health
# → { "status": "ok", "connections": 0, "uptime": 12.345 }
```

## 6. Frontend Integration

In the Next.js frontend, obtain the Supabase access token and connect:

```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  const ws = new WebSocket(`ws://localhost:8000/?token=${session.access_token}`);
}
```

## Troubleshooting

| Issue | Solution |
|:------|:---------|
| `Missing required env var` | Ensure `.env` exists in the `websocket/` directory with all required values |
| `401 Unauthorized` on connect | The Supabase access token is expired or invalid. Refresh it via `supabase.auth.refreshSession()` |
| `403 Forbidden` on connect | The user exists in `auth.users` but has no row in the `profile` table. Check your Supabase trigger |
| Messages not broadcasting | Verify the sender is a member of the room in `room_member` table |
