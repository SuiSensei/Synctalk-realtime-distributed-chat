import { ConnectedUser } from "./types";

/**
 * Active WebSocket connections keyed by Supabase user ID.
 * In-memory only — lost on server restart.
 */
export const connections = new Map<string, ConnectedUser>();

/**
 * Currently typing users. Ephemeral — not persisted.
 * Key: userId, Value: { roomId, timestamp }
 */
export const typingUsers = new Map<string, { roomId: string; timestamp: number }>();
