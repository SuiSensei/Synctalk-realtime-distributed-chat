import { UserProfile } from "../types";
import { broadcastToRoom } from "../helpers";
import { setTyping, clearTyping } from "../redis";

/**
 * Handle typing indicator — stores in Redis with 5s auto-expiry.
 * No in-memory state needed; Redis TTL handles cleanup automatically.
 */
export async function handleTyping(
  userId: string,
  profile: UserProfile,
  data: { roomId: string }
): Promise<void> {
  await setTyping(data.roomId, userId, profile.username);
  await broadcastToRoom(
    data.roomId,
    {
      type: "user_typing",
      roomId: data.roomId,
      user: { id: userId, username: profile.username },
    },
    userId
  );
}

/**
 * Handle stopped typing — clears Redis key immediately.
 */
export async function handleStoppedTyping(
  userId: string,
  data: { roomId: string },
  username?: string
): Promise<void> {
  await clearTyping(data.roomId, userId);
  await broadcastToRoom(
    data.roomId,
    { type: "user_stopped_typing", roomId: data.roomId, userId, username },
    userId
  );
}
