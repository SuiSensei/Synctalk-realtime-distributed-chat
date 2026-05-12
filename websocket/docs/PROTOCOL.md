# WebSocket Protocol Reference

## Connection

```
ws://localhost:8000/?token=SUPABASE_ACCESS_TOKEN
```

The `token` must be a valid Supabase access token obtained from `supabase.auth.getSession()`. The server validates it on upgrade and rejects with `401` if invalid.

### On Successful Connection

The server sends:

```json
{
  "type": "auth_success",
  "userId": "uuid",
  "profile": { "id": "...", "username": "...", "first_name": "...", ... }
}
```

---

## Message Types — Client → Server

### 1. Group Chat Message

```json
{ "type": "chat", "roomId": "room-uuid", "text": "Hello everyone!" }
```

### 2. Direct Message

```json
{ "type": "direct_message", "recipientId": "user-uuid", "text": "Hey!" }
```

### 3. Typing Indicator

```json
{ "type": "typing", "roomId": "room-uuid" }
```

### 4. Stopped Typing

```json
{ "type": "stopped_typing", "roomId": "room-uuid" }
```

### 5. Create Room

```json
{
  "type": "create_room",
  "name": "Project Team",
  "description": "Our team room",
  "avatar": "https://...",
  "memberIds": ["user-uuid-1", "user-uuid-2"],
  "isPrivate": false
}
```

### 6. Join Room

```json
{ "type": "join_room", "roomId": "room-uuid" }
```

### 7. Leave Room

```json
{ "type": "leave_room", "roomId": "room-uuid" }
```

### 8. Add Reaction

```json
{ "type": "add_reaction", "messageId": "msg-uuid", "emoji": "👍", "name": "thumbs_up" }
```

### 9. Remove Reaction

```json
{ "type": "remove_reaction", "messageId": "msg-uuid", "emoji": "👍" }
```

### 10. Mark as Read

```json
{ "type": "mark_as_read", "messageId": "msg-uuid" }
```

### 11. Update Status

```json
{ "type": "update_status", "status": "away" }
```

Status options: `available`, `away`, `busy`, `offline`

### 12. Update Profile

```json
{ "type": "update_profile", "username": "NewName", "avatar_url": "https://...", "about": "Hello!" }
```

### 13. Get Rooms

```json
{ "type": "get_rooms" }
```

### 14. Get Messages (Paginated)

```json
{ "type": "get_messages", "roomId": "room-uuid", "limit": 50, "before": "2026-05-12T00:00:00Z" }
```

---

## Message Types — Server → Client

### presence

```json
{
  "type": "presence",
  "users": [
    { "id": "uuid", "username": "John", "first_name": "John", "last_name": "Doe", "avatar_url": "...", "status": "available", "is_online": true }
  ]
}
```

### chat (broadcast)

```json
{
  "id": "msg-uuid", "type": "chat", "roomId": "room-uuid",
  "sender": { "id": "...", "username": "...", "first_name": "...", "last_name": "...", "avatar_url": "..." },
  "content": "Hello!", "timestamp": "2026-05-12T10:30:00Z", "reactions": [], "is_edited": false
}
```

### direct_message

Same as `chat` but with `"type": "direct_message"` and an additional `"read": false` field.

### user_typing / user_stopped_typing

```json
{ "type": "user_typing", "roomId": "room-uuid", "user": { "id": "uuid", "username": "Jane" } }
{ "type": "user_stopped_typing", "roomId": "room-uuid", "userId": "uuid" }
```

### room_created

```json
{ "type": "room_created", "room": { "id": "...", "name": "...", ... } }
```

### user_joined / user_left

```json
{ "type": "user_joined", "roomId": "...", "user": { "id": "...", "username": "..." } }
{ "type": "user_left", "roomId": "...", "userId": "...", "username": "..." }
```

### message_reacted

```json
{ "type": "message_reacted", "messageId": "...", "reactions": [{ "emoji": "👍", "user_id": "...", "name": "thumbs_up" }] }
```

### message_read

```json
{ "type": "message_read", "messageId": "...", "userId": "...", "readBy": ["uuid-1", "uuid-2"] }
```

### rooms_list

```json
{ "type": "rooms_list", "rooms": [{ "id": "...", "name": "...", "lastMessage": {...}, "memberCount": 5 }] }
```

### messages_list

```json
{ "type": "messages_list", "roomId": "...", "messages": [{ "id": "...", "sender": {...}, "content": "...", ... }] }
```

### error

```json
{ "type": "error", "message": "Description of what went wrong" }
```
