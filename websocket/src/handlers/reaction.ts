import { supabase } from "../supabase";
import { UserProfile } from "../types";
import { sendToUser, broadcastToRoom } from "../helpers";

/**
 * Add an emoji reaction to a message.
 * Persists to `message_reaction`, broadcasts updated reactions to room.
 */
export async function handleAddReaction(
  userId: string,
  profile: UserProfile,
  data: { messageId: string; emoji: string; name?: string }
): Promise<void> {
  // Prevent duplicates
  const { data: existing } = await supabase
    .from("message_reaction")
    .select("id")
    .eq("message_id", data.messageId)
    .eq("user_id", userId)
    .eq("emoji", data.emoji)
    .single();

  if (existing) return;

  await supabase.from("message_reaction").insert({
    message_id: data.messageId,
    user_id: userId,
    emoji: data.emoji,
    name: data.name || data.emoji,
  });

  await broadcastReactions(data.messageId);
  console.log(`😀 ${profile.username} reacted ${data.emoji} on ${data.messageId}`);
}

/**
 * Remove an emoji reaction from a message.
 * Deletes from `message_reaction`, broadcasts updated reactions to room.
 */
export async function handleRemoveReaction(
  userId: string,
  data: { messageId: string; emoji: string }
): Promise<void> {
  await supabase
    .from("message_reaction")
    .delete()
    .eq("message_id", data.messageId)
    .eq("user_id", userId)
    .eq("emoji", data.emoji);

  await broadcastReactions(data.messageId);
}

/** Fetch all reactions for a message and broadcast to the message's room. */
async function broadcastReactions(messageId: string): Promise<void> {
  const { data: allReactions } = await supabase
    .from("message_reaction")
    .select("emoji, user_id, name")
    .eq("message_id", messageId);

  const { data: msg } = await supabase
    .from("message")
    .select("room_id")
    .eq("id", messageId)
    .single();

  if (msg) {
    await broadcastToRoom(msg.room_id, {
      type: "message_reacted",
      messageId,
      reactions: allReactions || [],
    });
  }
}
