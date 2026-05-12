import { supabase } from "../supabase";
import { UserProfile } from "../types";
import { sendToUser, broadcastToRoom, getSenderInfo } from "../helpers";
import { invalidateRoomMembers } from "../redis";

/**
 * Create a new room (group chat).
 * Inserts into `room` and `room_member`, notifies all added members.
 */
export async function handleCreateRoom(
  userId: string,
  profile: UserProfile,
  data: { name?: string; avatar?: string; description?: string; memberIds?: string[]; isPrivate?: boolean }
): Promise<void> {
  const { data: room, error } = await supabase
    .from("room")
    .insert({
      name: data.name || "New Room",
      description: data.description || "",
      owner_id: userId,
      is_private: data.isPrivate || false,
      avatar_url: data.avatar || "",
    })
    .select()
    .single();

  if (error || !room) {
    console.error("Room creation error:", error);
    sendToUser(userId, { type: "error", message: "Failed to create room" });
    return;
  }

  const memberIds: string[] = data.memberIds ? [...data.memberIds] : [];
  if (!memberIds.includes(userId)) memberIds.push(userId);

  const memberRows = memberIds.map((mid) => ({
    room_id: room.id,
    user_id: mid,
    role: mid === userId ? "owner" : "member",
  }));

  await supabase.from("room_member").insert(memberRows);
  await invalidateRoomMembers(room.id);

  const msg = { type: "room_created", room };
  for (const mid of memberIds) {
    sendToUser(mid, msg);
  }

  console.log(`🏠 Room created: ${room.name} (${room.id}) by ${profile.username}`);
}

/**
 * Join an existing room.
 * Inserts into `room_member`, broadcasts join event to room.
 */
export async function handleJoinRoom(
  userId: string,
  profile: UserProfile,
  data: { roomId: string }
): Promise<void> {
  const { error } = await supabase
    .from("room_member")
    .insert({ room_id: data.roomId, user_id: userId, role: "member" });

  if (error) {
    const msg =
      error.code === "23505" ? "Already a member" : "Failed to join room";
    sendToUser(userId, { type: "error", message: msg });
    if (error.code !== "23505") console.error("Join room error:", error);
    return;
  }

  await invalidateRoomMembers(data.roomId);

  await broadcastToRoom(data.roomId, {
    type: "user_joined",
    roomId: data.roomId,
    user: getSenderInfo(profile),
  });

  console.log(`➡️ ${profile.username} joined room ${data.roomId}`);
}

/**
 * Leave a room.
 * Deletes from `room_member`, broadcasts leave event.
 */
export async function handleLeaveRoom(
  userId: string,
  profile: UserProfile,
  data: { roomId: string }
): Promise<void> {
  await supabase
    .from("room_member")
    .delete()
    .eq("room_id", data.roomId)
    .eq("user_id", userId);

  await invalidateRoomMembers(data.roomId);

  await broadcastToRoom(data.roomId, {
    type: "user_left",
    roomId: data.roomId,
    userId,
    username: profile.username,
  });

  console.log(`⬅️ ${profile.username} left room ${data.roomId}`);
}
