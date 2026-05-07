# WebSocket Protocol Guide

## Connection

```
ws://localhost:8000/?username=YOUR_USERNAME&avatar=AVATAR_URL
```

**Query Parameters:**
- `username` (required): User's display name
- `avatar` (optional): User's profile picture URL

**Example:**
```javascript
const ws = new WebSocket('ws://localhost:8000/?username=John&avatar=https://example.com/avatar.jpg');
```

---

## Message Types

### 1. **Presence Update** (Server → Client)
Sent when a user connects, disconnects, or updates their status.

```json
{
  "type": "presence",
  "users": [
    {
      "id": "uuid-123",
      "username": "John",
      "avatar": "https://...",
      "status": "online",
      "lastSeen": "2026-05-07T10:30:00Z"
    }
  ]
}
```

---

### 2. **Group Chat Message**

#### Send (Client → Server)
```json
{
  "type": "chat",
  "groupId": "group-uuid-123",
  "text": "Hello everyone!"
}
```

#### Receive (Server → Client)
```json
{
  "id": "message-uuid",
  "type": "chat",
  "groupId": "group-uuid-123",
  "sender": {
    "id": "user-uuid",
    "username": "John",
    "avatar": "https://..."
  },
  "text": "Hello everyone!",
  "timestamp": "2026-05-07T10:30:00Z",
  "reactions": [],
  "edited": false
}
```

---

### 3. **Direct Messages**

#### Send (Client → Server)
```json
{
  "type": "direct_message",
  "recipientId": "user-uuid-456",
  "text": "Hey, how are you?"
}
```

#### Receive (Server → Client)
```json
{
  "id": "dm-uuid",
  "type": "direct_message",
  "sender": {
    "id": "user-uuid-123",
    "username": "John",
    "avatar": "https://..."
  },
  "text": "Hey, how are you?",
  "timestamp": "2026-05-07T10:30:00Z",
  "read": false
}
```

---

### 4. **Typing Indicator**

#### Typing (Client → Server)
```json
{
  "type": "typing",
  "groupId": "group-uuid-123"
}
```

#### Stopped Typing (Client → Server)
```json
{
  "type": "stopped_typing",
  "groupId": "group-uuid-123"
}
```

#### Receive (Server → Client)
```json
{
  "type": "user_typing",
  "groupId": "group-uuid-123",
  "user": {
    "id": "user-uuid",
    "username": "Jane"
  }
}
```

```json
{
  "type": "user_stopped_typing",
  "groupId": "group-uuid-123",
  "userId": "user-uuid"
}
```

---

### 5. **Create Group**

#### Send (Client → Server)
```json
{
  "type": "create_group",
  "name": "Project Team",
  "avatar": "https://...",
  "description": "Team working on sync chat",
  "memberIds": ["user-uuid-123", "user-uuid-456"]
}
```

#### Receive (Server → Client)
```json
{
  "type": "group_created",
  "group": {
    "id": "group-uuid",
    "name": "Project Team",
    "avatar": "https://...",
    "members": ["user-uuid-123", "user-uuid-456"],
    "creator": "user-uuid-123",
    "createdAt": "2026-05-07T10:30:00Z",
    "description": "Team working on sync chat"
  }
}
```

---

### 6. **Join Group**

#### Send (Client → Server)
```json
{
  "type": "join_group",
  "groupId": "group-uuid-123"
}
```

#### Receive (Server → Client)
```json
{
  "type": "user_joined",
  "groupId": "group-uuid-123",
  "user": {
    "id": "user-uuid",
    "username": "John",
    "avatar": "https://..."
  }
}
```

---

### 7. **Leave Group**

#### Send (Client → Server)
```json
{
  "type": "leave_group",
  "groupId": "group-uuid-123"
}
```

#### Receive (Server → Client)
```json
{
  "type": "user_left",
  "groupId": "group-uuid-123",
  "userId": "user-uuid",
  "username": "John"
}
```

---

### 8. **Message Reactions**

#### Add Reaction (Client → Server)
```json
{
  "type": "add_reaction",
  "messageId": "message-uuid",
  "emoji": "👍"
}
```

#### Remove Reaction (Client → Server)
```json
{
  "type": "remove_reaction",
  "messageId": "message-uuid",
  "emoji": "👍"
}
```

#### Receive (Server → Client)
```json
{
  "type": "message_reacted",
  "messageId": "message-uuid",
  "reactions": [
    {
      "emoji": "👍",
      "userId": "user-uuid-123",
      "username": "John"
    },
    {
      "emoji": "😂",
      "userId": "user-uuid-456",
      "username": "Jane"
    }
  ]
}
```

---

### 9. **Read Receipts**

#### Mark as Read (Client → Server)
```json
{
  "type": "mark_as_read",
  "messageId": "message-uuid"
}
```

#### Receive (Server → Client)
```json
{
  "type": "message_read",
  "messageId": "message-uuid",
  "userId": "user-uuid-456",
  "readBy": ["user-uuid-456", "user-uuid-789"]
}
```

---

### 10. **File Upload**

#### Send (Client → Server)
```json
{
  "type": "file_upload",
  "groupId": "group-uuid-123",
  "fileName": "photo.jpg",
  "fileType": "image",
  "fileUrl": "data:image/jpeg;base64,...",
  "fileSize": 256000
}
```

**fileType options:** `image`, `video`, `file`

#### Receive (Server → Client)
```json
{
  "id": "file-message-uuid",
  "type": "file",
  "groupId": "group-uuid-123",
  "sender": {
    "id": "user-uuid",
    "username": "John",
    "avatar": "https://..."
  },
  "fileName": "photo.jpg",
  "fileType": "image",
  "fileUrl": "data:image/jpeg;base64,...",
  "fileSize": 256000,
  "timestamp": "2026-05-07T10:30:00Z"
}
```

---

### 11. **Update User Status**

#### Send (Client → Server)
```json
{
  "type": "update_status",
  "status": "away"
}
```

**Status options:** `online`, `away`, `offline`

---

### 12. **Update User Profile**

#### Send (Client → Server)
```json
{
  "type": "update_profile",
  "username": "NewUsername",
  "avatar": "https://new-avatar.jpg",
  "bio": "I love coding!"
}
```

---

### 13. **Get Groups**

#### Send (Client → Server)
```json
{
  "type": "get_groups"
}
```

#### Receive (Server → Client)
```json
{
  "type": "groups_list",
  "groups": [
    {
      "id": "group-uuid-1",
      "name": "Project Team",
      "avatar": "https://...",
      "members": ["user-uuid-123", "user-uuid-456"],
      "creator": "user-uuid-123",
      "createdAt": "2026-05-07T10:00:00Z",
      "description": "Team working on sync chat"
    }
  ]
}
```

---

### 14. **Get Messages**

#### Send (Client → Server)
```json
{
  "type": "get_messages",
  "groupId": "group-uuid-123"
}
```

#### Receive (Server → Client)
```json
{
  "type": "messages_list",
  "groupId": "group-uuid-123",
  "messages": [
    {
      "id": "message-uuid",
      "type": "chat",
      "groupId": "group-uuid-123",
      "sender": { "id": "user-uuid", "username": "John", "avatar": "https://..." },
      "text": "Hello!",
      "timestamp": "2026-05-07T10:30:00Z",
      "reactions": [],
      "edited": false
    }
  ]
}
```

---

## Example Frontend Implementation

### React Hook Example

```javascript
import { useEffect, useRef, useState } from 'react';

export function useWebSocket(username, avatar) {
  const ws = useRef(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [typing, setTyping] = useState({});

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://localhost:8000/?username=${username}&avatar=${avatar}`
    );

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'presence':
          setUsers(data.users);
          break;
        case 'chat':
        case 'direct_message':
          setMessages(prev => ({
            ...prev,
            [data.id]: data
          }));
          break;
        case 'user_typing':
          setTyping(prev => ({
            ...prev,
            [data.user.id]: data.user
          }));
          break;
        case 'user_stopped_typing':
          setTyping(prev => {
            const newTyping = { ...prev };
            delete newTyping[data.userId];
            return newTyping;
          });
          break;
      }
    };

    return () => ws.current?.close();
  }, [username, avatar]);

  const sendMessage = (groupId, text) => {
    ws.current?.send(JSON.stringify({
      type: 'chat',
      groupId,
      text
    }));
  };

  const sendDirectMessage = (recipientId, text) => {
    ws.current?.send(JSON.stringify({
      type: 'direct_message',
      recipientId,
      text
    }));
  };

  const sendTyping = (groupId) => {
    ws.current?.send(JSON.stringify({
      type: 'typing',
      groupId
    }));
  };

  const stopTyping = (groupId) => {
    ws.current?.send(JSON.stringify({
      type: 'stopped_typing',
      groupId
    }));
  };

  const addReaction = (messageId, emoji) => {
    ws.current?.send(JSON.stringify({
      type: 'add_reaction',
      messageId,
      emoji
    }));
  };

  const markAsRead = (messageId) => {
    ws.current?.send(JSON.stringify({
      type: 'mark_as_read',
      messageId
    }));
  };

  return {
    users,
    messages,
    typing,
    sendMessage,
    sendDirectMessage,
    sendTyping,
    stopTyping,
    addReaction,
    markAsRead
  };
}
```

---

## Testing with Postman / WebSocket Client

### Connection URL
```
ws://localhost:8000/?username=TestUser&avatar=https://via.placeholder.com/40
```

### Sample Message - Send Chat
```json
{
  "type": "chat",
  "groupId": "group-123",
  "text": "Hello WebSocket!"
}
```

### Sample Message - Create Group
```json
{
  "type": "create_group",
  "name": "My Group",
  "avatar": "https://via.placeholder.com/40",
  "description": "A test group",
  "memberIds": []
}
```

---

## Error Handling

If there's an error processing a message, you'll receive:

```json
{
  "type": "error",
  "message": "Invalid message format"
}
```

---

## Best Practices

1. **Always include `type` field** in messages
2. **Use UUIDs** for IDs (provided by server)
3. **Handle connection failures** with reconnection logic
4. **Throttle typing indicators** to avoid spam (send every 300ms)
5. **Keep-alive pings** if connection seems idle (optional)
6. **Validate user input** before sending
7. **Use appropriate file sizes** for files (recommended max 5MB)
