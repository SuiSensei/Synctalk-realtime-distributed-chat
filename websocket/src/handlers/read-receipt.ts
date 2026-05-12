import { supabase } from "../supabase";
import { sendToUser } from "../helpers";

/**
 * Mark a message as read.
 * Upserts into `message_read`, then notifies the message sender
 * with the full list of readers.
 */
export async function handleMarkAsRead(
  userId: string,
  data: { messageId: string }
): Promise<void> {
  const now = new Date().toISOString();

  // Upsert read receipt
  const { data: existing } = await supabase
    .from("message_read")
    .select("id")
    .eq("message_id", data.messageId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase
      .from("message_read")
      .update({ status: "read", read_at: now, updated_at: now })
      .eq("id", existing.id);
  } else {
    await supabase.from("message_read").insert({
      message_id: data.messageId,
      user_id: userId,
      status: "read",
      read_at: now,
    });
  }

  // Collect all readers and notify the message sender
  const { data: readers } = await supabase
    .from("message_read")
    .select("user_id")
    .eq("message_id", data.messageId)
    .eq("status", "read");

  const { data: msg } = await supabase
    .from("message")
    .select("user_id, room_id")
    .eq("id", data.messageId)
    .single();

  if (msg) {
    sendToUser(msg.user_id, {
      type: "message_read",
      messageId: data.messageId,
      userId,
      readBy: readers?.map((r) => r.user_id) || [],
    });
  }
}
