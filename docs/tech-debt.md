# SyncTalk Technical Debt

- **Pagination**: The `get_messages` WS endpoint currently fetches the latest 50 messages. Cursor-based pagination and infinite scrolling UI need to be implemented.
- **File Uploads**: Image/Attachment sharing is not yet implemented. Requires Supabase Storage integration and new WS message types.
- **Message Editing/Deletion**: Backend supports reaction additions, but message modification/deletion needs complete UI and handler wiring.
- **Push Notifications**: Only in-app real-time events are supported. Offline notifications (Web Push / FCM) are deferred.
- **Presence Optimization**: Currently, presence updates are synchronized on every broadcast; a more scalable approach would be independent heartbeat intervals.
- **Direct Messaging Search**: The "New DM" button currently has a placeholder alert. Needs a user search modal to fetch profiles and create DM rooms.