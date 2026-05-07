# SyncTalk WebSocket Server

Real-time distributed chat backend powered by WebSockets.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```
2. **Run the server:**
```bash
node index.js
```

The server will be available at: `ws://localhost:8000`

---

## For Frontend Developer

### Connection
```javascript
import { syncTalkClient } from './client';

// Connect to WebSocket
await syncTalkClient.connect('username', 'https://avatar-url.jpg');

// Listen for messages
syncTalkClient.on('chat-message', (message) => {
  console.log('New message:', message);
});

syncTalkClient.on('users-list', (users) => {
  console.log('Online users:', users);
});
```

### Sending Messages
```javascript
// Send group chat
syncTalkClient.sendMessage('group-id', 'Hello everyone!');

// Send direct message
syncTalkClient.sendDirectMessage('user-id', 'Hey!');

// Notify typing
syncTalkClient.notifyTyping('group-id');
```

### Creating Groups
```javascript
syncTalkClient.createGroup('My Group', ['user-id-1', 'user-id-2']);
```

### Adding Reactions
```javascript
syncTalkClient.addReaction('message-id', '👍');
```

---

## Testing

### Using WebSocket CLI or Postman:

1. Connect to: `ws://localhost:8000/?username=TestUser&avatar=https://via.placeholder.com/40`

2. Send messages:
```json
{
  "type": "chat",
  "groupId": "test-group",
  "text": "Hello!"
}
```

### Multiple Connections
Open multiple WebSocket connections to simulate multiple users chatting.

---

## File Structure

```
websocket/
├── index.js                # Main WebSocket server (ALL FEATURES)
├── server.ts              # Socket.IO version (not used)
├── client.ts              # TypeScript client library
├── PROTOCOL.md            # Full protocol documentation
├── README.md              # This file
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

---

## Key Message Types

| Type | Direction | Purpose |
|------|-----------|---------|
| `chat` | ↔️ | Group chat messages |
| `direct_message` | ↔️ | 1-on-1 messages |
| `typing` | → | Notify when typing |
| `stopped_typing` | → | Notify stopped typing |
| `presence` | ← | User list & status |
| `create_group` | → | Create new group |
| `join_group` | → | Join existing group |
| `add_reaction` | → | React to message |
| `mark_as_read` | → | Mark message as read |
| `file_upload` | → | Upload file |
| `update_status` | → | Change online status |

**→** = Client sends  
**←** = Server sends  
**↔️** = Both directions  

---

## Full Documentation

See [PROTOCOL.md](./PROTOCOL.md) for:
- Complete message schemas
- All event types
- Example implementations
- Error handling

---

## Common Frontend Patterns

### React Hook
```typescript
import { useEffect, useState } from 'react';
import { syncTalkClient } from './websocket/client';

export function useSyncTalk(username: string) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState([]);

  useEffect(() => {
    syncTalkClient.connect(username).then(() => {
      syncTalkClient.on('chat-message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      syncTalkClient.on('users-list', (userList) => {
        setUsers(userList);
      });

      syncTalkClient.on('typing', (data) => {
        setTyping(prev => [...prev, data.user]);
      });
    });

    return () => syncTalkClient.disconnect();
  }, [username]);

  return { messages, users, typing, client: syncTalkClient };
}
```

### Vue Composable
```typescript
import { ref, onMounted, onUnmounted } from 'vue';
import { syncTalkClient } from './websocket/client';

export function useSyncTalk(username: string) {
  const messages = ref([]);
  const users = ref([]);
  const connected = ref(false);

  const handleMessage = (msg: any) => {
    messages.value.push(msg);
  };

  const handleUsers = (userList: any) => {
    users.value = userList;
  };

  onMounted(async () => {
    await syncTalkClient.connect(username);
    syncTalkClient.on('chat-message', handleMessage);
    syncTalkClient.on('users-list', handleUsers);
    connected.value = true;
  });

  onUnmounted(() => {
    syncTalkClient.off('chat-message', handleMessage);
    syncTalkClient.off('users-list', handleUsers);
    syncTalkClient.disconnect();
  });

  return { messages, users, connected, client: syncTalkClient };
}
```

---

## Troubleshooting

**Connection refused?**
- Make sure the server is running: `node index.js`
- Check the port (default: 8000)
- Check your firewall settings

**Messages not received?**
- Check that username is provided in connection URL
- Check WebSocket readyState (should be 1 = OPEN)
- Check browser console for errors

**Group ID errors?**
- Make sure you're using a valid group ID
- Create a group first before sending messages to it

---

## Architecture

```
Client (React/Vue/etc)
    ↓
    ↕ WebSocket (ws://)
    ↓
index.js (Express HTTP Server)
    ├── User Management
    ├── Group Management
    ├── Message Storage
    ├── Broadcasting Logic
    └── State Management
```

---

## Next Steps

1. **Frontend dev**: Copy `client.ts` to frontend project
2. **Frontend dev**: Use the `useSyncTalk` hook/composable in components
3. **Backend dev**: Monitor logs and respond to issues
4. **Both**: Test all features with multiple users

---

## Support

- Protocol issues? → See [PROTOCOL.md](./PROTOCOL.md)
- Client library issues? → Check `client.ts` implementation
- Server issues? → Check `index.js` console logs
