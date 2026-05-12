import { supabase } from "../supabase";
import { sendToUser } from "../helpers";

/**
 * Handle profile update.
 */
export async function handleUpdateProfile(
  userId: string,
  data: { username?: string; first_name?: string; last_name?: string; avatar_url?: string }
): Promise<void> {
  const updates: Record<string, any> = {};
  if (data.username) updates.username = data.username;
  if (data.first_name) updates.first_name = data.first_name;
  if (data.last_name) updates.last_name = data.last_name;
  if (data.avatar_url !== undefined) updates.avatar_url = data.avatar_url;

  if (Object.keys(updates).length === 0) {
    sendToUser(userId, { type: "error", message: "No fields to update" });
    return;
  }

  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("profile")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Profile update error:", error);
    sendToUser(userId, { type: "error", message: "Failed to update profile" });
    return;
  }

  const { data: updated } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  sendToUser(userId, { type: "profile_updated", profile: updated });
  console.log(`👤 Profile updated for ${userId}`);
}
