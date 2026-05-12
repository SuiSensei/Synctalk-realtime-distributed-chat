import { UserProfile } from "../types";
import { supabase } from "../supabase";
import { setPresence, clearPresence } from "../redis";
import { broadcastPresence } from "../helpers";

/**
 * Handle status update (available, away, busy, offline).
 */
export async function handleUpdateStatus(
  userId: string,
  profile: UserProfile,
  data: { status: string }
): Promise<void> {
  const now = new Date().toISOString();
  await supabase
    .from("user_status")
    .upsert({ user_id: userId, status: data.status, last_active: now, updated_at: now });

  await setPresence(userId, { id: profile.id, username: profile.username, status: data.status });
  await broadcastPresence();
  console.log(`🔄 ${profile.username} status → ${data.status}`);
}
