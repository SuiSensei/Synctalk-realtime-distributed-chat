import { WebSocket } from "ws";

// ─── User / Connection ───────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string;
  is_online: boolean;
  status: string;
  last_active: string;
  about: string;
}

export interface ConnectedUser {
  ws: WebSocket;
  profile: UserProfile;
}

export interface SenderInfo {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

// ─── Incoming WS Message Payloads (Client → Server) ─────────────────────────

export interface ChatPayload {
  type: "chat";
  roomId: string;
  text: string;
}

export interface DirectMessagePayload {
  type: "direct_message";
  recipientId: string;
  text: string;
}

export interface TypingPayload {
  type: "typing";
  roomId: string;
}

export interface StoppedTypingPayload {
  type: "stopped_typing";
  roomId: string;
}

export interface CreateRoomPayload {
  type: "create_room";
  name: string;
  avatar?: string;
  description?: string;
  memberIds?: string[];
  isPrivate?: boolean;
}

export interface JoinRoomPayload {
  type: "join_room";
  roomId: string;
}

export interface LeaveRoomPayload {
  type: "leave_room";
  roomId: string;
}

export interface AddReactionPayload {
  type: "add_reaction";
  messageId: string;
  emoji: string;
  name?: string;
}

export interface RemoveReactionPayload {
  type: "remove_reaction";
  messageId: string;
  emoji: string;
}

export interface MarkAsReadPayload {
  type: "mark_as_read";
  messageId: string;
}

export interface UpdateStatusPayload {
  type: "update_status";
  status: string;
}

export interface UpdateProfilePayload {
  type: "update_profile";
  username?: string;
  avatar_url?: string;
  about?: string;
}

export interface GetRoomsPayload {
  type: "get_rooms";
}

export interface GetMessagesPayload {
  type: "get_messages";
  roomId: string;
  limit?: number;
  before?: string;
}

export type IncomingMessage =
  | ChatPayload
  | DirectMessagePayload
  | TypingPayload
  | StoppedTypingPayload
  | CreateRoomPayload
  | JoinRoomPayload
  | LeaveRoomPayload
  | AddReactionPayload
  | RemoveReactionPayload
  | MarkAsReadPayload
  | UpdateStatusPayload
  | UpdateProfilePayload
  | GetRoomsPayload
  | GetMessagesPayload;
