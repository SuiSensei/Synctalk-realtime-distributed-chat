import { supabase } from "../supabase";
import { UserProfile } from "../types";
import { sendToUser, broadcastToRoom, getSenderInfo } from "../helpers";
import { invalidateMessages } from "../redis";

/**
 * Handle a group chat message.
 * Verifies room membership, persists to `message` table, broadcasts to room.
 */
export async function handleChat(
  userId: string,
  profile: UserProfile,
  data: { roomId: string; text: string }
): Promise<void> {
  // Verify membership
  const { data: membership } = await supabase
    .from("room_member")
    .select("user_id")
    .eq("room_id", data.roomId)
    .eq("user_id", userId)
    .single();

  if (!membership) {
    sendToUser(userId, { type: "error", message: "Not a member of this room" });
    return;
  }

  // Persist
  const { data: msg, error } = await supabase
    .from("message")
    .insert({ content: data.text, user_id: userId, room_id: data.roomId, type: "text" })
    .select()
    .single();

  if (error || !msg) {
    console.error("Message insert error:", error);
    sendToUser(userId, { type: "error", message: "Failed to send message" });
    return;
  }

  // Broadcast to all room members
  await broadcastToRoom(data.roomId, {
    id: msg.id,
    type: "chat",
    roomId: data.roomId,
    sender: getSenderInfo(profile),
    content: msg.content,
    timestamp: msg.created_at,
    reactions: [],
    is_edited: false,
  });

  // Invalidate cached messages for this room
  await invalidateMessages(data.roomId);

  console.log(`💬 [${profile.username}] in ${data.roomId}: ${data.text}`);
}
