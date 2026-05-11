const http = require('http');
const WebSocket = require('ws');

const url = require('url');
const uuidv4 = require('uuid').v4;

const server = http.createServer();
const wss = new WebSocket.Server({ server });
const port = 8000;

// Retention limits for in-memory stores to avoid unbounded growth.
const MAX_CONNECTIONS = 10000;
const MAX_USERS = 10000;
const MAX_GROUPS = 5000;
const MAX_MESSAGE_BUCKETS = 10000;
const MAX_DIRECT_MESSAGE_BUCKETS = 10000;
const MAX_TYPING_USERS = 10000;
const MAX_READ_RECEIPT_BUCKETS = 10000;

const createBoundedStore = (maxEntries) => {
  const target = {};
  const order = [];

  const evictIfNeeded = () => {
    while (order.length > maxEntries) {
      const oldestKey = order.shift();
      if (oldestKey !== undefined) {
        delete target[oldestKey];
      }
    }
  };

  return new Proxy(target, {
    set(obj, prop, value) {
      if (typeof prop === 'symbol') {
        obj[prop] = value;
        return true;
      }

      const key = String(prop);
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        order.push(key);
      } else {
        const existingIndex = order.indexOf(key);
        if (existingIndex !== -1) {
          order.splice(existingIndex, 1);
        }
        order.push(key);
      }

      obj[key] = value;
      evictIfNeeded();
      return true;
    },
    deleteProperty(obj, prop) {
      if (typeof prop === 'symbol') {
        return delete obj[prop];
      }

      const key = String(prop);
      const existingIndex = order.indexOf(key);
      if (existingIndex !== -1) {
        order.splice(existingIndex, 1);
      }
      return delete obj[key];
    }
  });
};

// Data structures
const connections = createBoundedStore(MAX_CONNECTIONS);
const users = createBoundedStore(MAX_USERS);
const groups = createBoundedStore(MAX_GROUPS);
const messages = createBoundedStore(MAX_MESSAGE_BUCKETS);
const directMessages = createBoundedStore(MAX_DIRECT_MESSAGE_BUCKETS);
const typingUsers = createBoundedStore(MAX_TYPING_USERS);
const readReceipts = createBoundedStore(MAX_READ_RECEIPT_BUCKETS);


//Broadcast user list and presence to all connected clients
const broadcastPresence = () => {
  const userList = Object.entries(users).map(([uuid, user]) => ({
    id: uuid,
    username: user.username,
    avatar: user.avatar,
    status: user.status || 'online',
    lastSeen: user.lastSeen,
  }));

  const message = JSON.stringify({ type: 'presence', users: userList });
  Object.values(connections).forEach(conn => {
    if (conn.readyState === WebSocket.OPEN) {
      conn.send(message);
    }
  });
};


//Broadcast to all users in a group
const broadcastToGroup = (groupId, message) => {
  if (!groups[groupId]) return;
  
  groups[groupId].members.forEach(memberId => {
    if (connections[memberId] && connections[memberId].readyState === WebSocket.OPEN) {
      connections[memberId].send(JSON.stringify(message));
    }
  });
};


//Send direct message to a specific user
const sendToUser = (userId, message) => {
  if (connections[userId] && connections[userId].readyState === WebSocket.OPEN) {
    connections[userId].send(JSON.stringify(message));
  }
};

wss.on('connection', (connection, request) => {
  const { username, avatar } = url.parse(request.url, true).query;
  const userId = uuidv4();

  if (!username) {
    connection.close(1008, 'Username is required');
    return;
  }

  console.log(`User connected: ${username} (${userId})`);

  connections[userId] = connection;
  users[userId] = {
    username: username || 'Anonymous',
    avatar: avatar || 'https://via.placeholder.com/40',
    status: 'online',
    lastSeen: new Date(),
    joinedAt: new Date(),
  };

  // Notify all users about the new user
  broadcastPresence();

  connection.on('message', (messageAsString) => {
    try {
      const data = JSON.parse(messageAsString);

      // GROUP CHAT MESSAGES
      if (data.type === 'chat' && data.groupId) {
        const messageId = uuidv4();
        const chatMessage = {
          id: messageId,
          type: 'chat',
          groupId: data.groupId,
          sender: {
            id: userId,
            username: users[userId].username,
            avatar: users[userId].avatar,
          },
          text: data.text,
          timestamp: new Date(),
          reactions: [],
          edited: false,
        };

        messages[messageId] = chatMessage;
        broadcastToGroup(data.groupId, chatMessage);
        console.log(`Chat message in group ${data.groupId}: ${data.text}`);
      }

      // DIRECT MESSAGES
      if (data.type === 'direct_message' && data.recipientId) {
        const conversationId = [userId, data.recipientId].sort().join('-');
        const messageId = uuidv4();
        const directMsg = {
          id: messageId,
          type: 'direct_message',
          sender: {
            id: userId,
            username: users[userId].username,
            avatar: users[userId].avatar,
          },
          text: data.text,
          timestamp: new Date(),
          read: false,
        };

        if (!directMessages[conversationId]) {
          directMessages[conversationId] = [];
        }
        directMessages[conversationId].push(directMsg);

        // Send to recipient
        sendToUser(data.recipientId, directMsg);
        console.log(`Direct message from ${users[userId].username} to ${data.recipientId}`);
      }

      // TYPING INDICATORS 
      if (data.type === 'typing' && data.groupId) {
        const group = groups[data.groupId];
        if (group && group.members.includes(userId)) {
          typingUsers[userId] = { groupId: data.groupId, timestamp: Date.now() };
          const typingData = {
            type: 'user_typing',
            groupId: data.groupId,
            user: {
              id: userId,
              username: users[userId].username,
            },
          };
          broadcastToGroup(data.groupId, typingData);
          console.log(`⌨${users[userId].username} is typing in group ${data.groupId}`);
        }
      }

      // STOPPED TYPING
      if (data.type === 'stopped_typing' && data.groupId) {
        const group = groups[data.groupId];
        if (group && group.members.includes(userId)) {
          delete typingUsers[userId];
          const stoppedData = {
            type: 'user_stopped_typing',
            groupId: data.groupId,
            userId: userId,
          };
          broadcastToGroup(data.groupId, stoppedData);
        }
      }

      // CREATE GROUP
      if (data.type === 'create_group') {
        const groupId = uuidv4();
        const members = data.memberIds || [userId];
        if (!members.includes(userId)) members.push(userId);

        groups[groupId] = {
          id: groupId,
          name: data.name || 'New Group',
          avatar: data.avatar || 'https://via.placeholder.com/40',
          members: members,
          creator: userId,
          createdAt: new Date(),
          description: data.description || '',
        };

        // Notify all group members
        const groupCreatedMsg = {
          type: 'group_created',
          group: groups[groupId],
        };
        broadcastToGroup(groupId, groupCreatedMsg);
        console.log(`Group created: ${data.name} (${groupId})`);
      }

      // JOIN GROUP
      if (data.type === 'join_group' && data.groupId) {
        if (groups[data.groupId] && !groups[data.groupId].members.includes(userId)) {
          groups[data.groupId].members.push(userId);
          const joinMsg = {
            type: 'user_joined',
            groupId: data.groupId,
            user: {
              id: userId,
              username: users[userId].username,
              avatar: users[userId].avatar,
            },
          };
          broadcastToGroup(data.groupId, joinMsg);
          console.log(`${users[userId].username} joined group ${data.groupId}`);
        }
      }

      //LEAVE GROUP
      if (data.type === 'leave_group' && data.groupId) {
        if (groups[data.groupId]) {
          groups[data.groupId].members = groups[data.groupId].members.filter(m => m !== userId);
          const leaveMsg = {
            type: 'user_left',
            groupId: data.groupId,
            userId: userId,
            username: users[userId].username,
          };
          broadcastToGroup(data.groupId, leaveMsg);
          console.log(`${users[userId].username} left group ${data.groupId}`);
        }
      }

      //MESSAGE REACTIONS
      if (data.type === 'add_reaction' && data.messageId) {
        if (messages[data.messageId]) {
          const existingReaction = messages[data.messageId].reactions.find(
            r => r.emoji === data.emoji && r.userId === userId
          );

          if (!existingReaction) {
            messages[data.messageId].reactions.push({
              emoji: data.emoji,
              userId: userId,
              username: users[userId].username,
            });
          }

          const groupId = messages[data.messageId].groupId;
          broadcastToGroup(groupId, {
            type: 'message_reacted',
            messageId: data.messageId,
            reactions: messages[data.messageId].reactions,
          });
          console.log(`Reaction added to message ${data.messageId}`);
        }
      }

      //REMOVE REACTION
      if (data.type === 'remove_reaction' && data.messageId) {
        if (messages[data.messageId]) {
          messages[data.messageId].reactions = messages[data.messageId].reactions.filter(
            r => !(r.emoji === data.emoji && r.userId === userId)
          );

          const groupId = messages[data.messageId].groupId;
          broadcastToGroup(groupId, {
            type: 'message_reacted',
            messageId: data.messageId,
            reactions: messages[data.messageId].reactions,
          });
        }
      }

      //READ RECEIPT
      if (data.type === 'mark_as_read' && data.messageId) {
        if (!readReceipts[data.messageId]) {
          readReceipts[data.messageId] = [];
        }
        if (!readReceipts[data.messageId].includes(userId)) {
          readReceipts[data.messageId].push(userId);
        }

        // Notify sender about read receipt
        const message = messages[data.messageId];
        if (message) {
          sendToUser(message.sender.id, {
            type: 'message_read',
            messageId: data.messageId,
            userId: userId,
            readBy: readReceipts[data.messageId],
          });
        }
      }

      // USER STATUS UPDATE
      if (data.type === 'update_status') {
        users[userId].status = data.status; // online, away, offline
        broadcastPresence();
        console.log(`${users[userId].username} status: ${data.status}`);
      }

      // USER PROFILE UPDATE 
      if (data.type === 'update_profile') {
        if (data.username) users[userId].username = data.username;
        if (data.avatar) users[userId].avatar = data.avatar;
        if (data.bio) users[userId].bio = data.bio;
        broadcastPresence();
        console.log(`${data.username || users[userId].username} updated profile`);
      }

      // GET GROUPS 
      if (data.type === 'get_groups') {
        const userGroups = Object.values(groups).filter(g =>
          g.members.includes(userId)
        );
        sendToUser(userId, {
          type: 'groups_list',
          groups: userGroups,
        });
      }

      // GET MESSAGES
      if (data.type === 'get_messages' && data.groupId) {
        const groupMessages = Object.values(messages).filter(m =>
          m.groupId === data.groupId
        );
        sendToUser(userId, {
          type: 'messages_list',
          groupId: data.groupId,
          messages: groupMessages,
        });
      }

    } catch (err) {
      console.error('Message parsing error:', err);
      sendToUser(userId, {
        type: 'error',
        message: 'Invalid message format',
      });
    }
  });

  connection.on('close', () => {
    console.log(`User disconnected: ${users[userId]?.username} (${userId})`);
    users[userId].status = 'offline';
    users[userId].lastSeen = new Date();
    delete connections[userId];
    delete typingUsers[userId];
    broadcastPresence();
  });

  connection.on('error', (error) => {
    console.error(`WebSocket error for ${userId}:`, error);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server listening on ws://localhost:${port}`);
});
