import { supabase } from "../supabase";
import { UserProfile } from "../types";
import { sendToUser } from "../helpers";

/**
 * Handle sending a friend request via WebSocket.
 * Inserts into `friends` table, notifies the target user in real time.
 */
export async function handleSendFriendRequest(
  userId: string,
  profile: UserProfile,
  data: { targetUserId: string }
): Promise<void> {
  if (!data.targetUserId) {
    sendToUser(userId, { type: "error", message: "Missing targetUserId" });
    return;
  }

  // Prevent self-friending
  if (data.targetUserId === userId) {
    sendToUser(userId, { type: "error", message: "Cannot send a friend request to yourself" });
    return;
  }

  // Check if a relationship already exists
  const { data: existing } = await supabase
    .from("friends")
    .select("id, status")
    .or(`and(user_id.eq.${userId},friend_id.eq.${data.targetUserId}),and(user_id.eq.${data.targetUserId},friend_id.eq.${userId})`)
    .single();

  if (existing) {
    sendToUser(userId, { type: "error", message: existing.status === "accepted" ? "Already friends" : "Request already exists" });
    return;
  }

  const { error } = await supabase
    .from("friends")
    .insert({
      user_id: userId,
      friend_id: data.targetUserId,
      status: "pending",
    });

  if (error) {
    console.error("Friend request insert error:", error);
    sendToUser(userId, { type: "error", message: "Failed to send friend request" });
    return;
  }

  // Notify sender (confirmation)
  sendToUser(userId, {
    type: "friend_request_sent",
    targetUserId: data.targetUserId,
  });

  // Notify recipient in real time
  sendToUser(data.targetUserId, {
    type: "friend_request_received",
    from: {
      id: profile.id,
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_url: profile.avatar_url,
    },
  });

  console.log(`🤝 ${profile.username} sent friend request to ${data.targetUserId}`);
}

/**
 * Handle responding to a friend request (accept/reject) via WebSocket.
 * Updates `friends` row, notifies the original sender in real time.
 */
export async function handleRespondFriendRequest(
  userId: string,
  profile: UserProfile,
  data: { requestId: string; action: "accept" | "reject" }
): Promise<void> {
  if (!data.requestId || !data.action) {
    sendToUser(userId, { type: "error", message: "Missing requestId or action" });
    return;
  }

  // Fetch the request to verify it's addressed to this user
  const { data: request, error: fetchErr } = await supabase
    .from("friends")
    .select("*")
    .eq("id", data.requestId)
    .eq("friend_id", userId)
    .eq("status", "pending")
    .single();

  if (fetchErr || !request) {
    sendToUser(userId, { type: "error", message: "Friend request not found" });
    return;
  }

  if (data.action === "accept") {
    await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("id", data.requestId);

    // Notify the original sender
    sendToUser(request.user_id, {
      type: "friend_request_accepted",
      by: {
        id: profile.id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
      },
    });

    // Confirm to the accepter
    sendToUser(userId, {
      type: "friend_request_accepted",
      by: {
        id: profile.id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
      },
    });

    console.log(`✅ ${profile.username} accepted friend request from ${request.user_id}`);
  } else {
    await supabase
      .from("friends")
      .delete()
      .eq("id", data.requestId);

    // Notify the original sender
    sendToUser(request.user_id, {
      type: "friend_request_rejected",
      by: { id: profile.id, username: profile.username },
    });

    // Confirm to the rejecter
    sendToUser(userId, {
      type: "friend_request_rejected",
      by: { id: profile.id, username: profile.username },
    });

    console.log(`❌ ${profile.username} rejected friend request from ${request.user_id}`);
  }
}
