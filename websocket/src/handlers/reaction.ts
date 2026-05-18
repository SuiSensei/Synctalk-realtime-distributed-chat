import { supabase } from "../supabase";
import { UserProfile } from "../types";
import { sendToUser, broadcastToRoom } from "../helpers";

/**
 * Add an emoji reaction to a message.
 * Enforces ONE reaction per user per message:
 * - If the user clicks the same emoji they already have → toggle off (remove it).
 * - If the user clicks a different emoji → replace the old one.
 */
export async function handleAddReaction(
  userId: string,
  profile: UserProfile,
  data: { messageId: string; emoji: string; name?: string }
): Promise<void> {
  // Check if user already has a reaction on this message
  const { data: existing } = await supabase
    .from("message_reaction")
    .select("id, emoji")
    .eq("message_id", data.messageId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    if (existing.emoji === data.emoji) {
      // Same emoji → toggle off (remove)
      await supabase
        .from("message_reaction")
        .delete()
        .eq("id", existing.id);

      await broadcastReactions(data.messageId);
      console.log(`😀 ${profile.username} toggled off ${data.emoji} on ${data.messageId}`);
      return;
    }

    // Different emoji → remove old one first
    await supabase
      .from("message_reaction")
      .delete()
      .eq("id", existing.id);
  }

  // Insert the new reaction
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
