import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePresence } from './use-presence';

export interface FriendRecord {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  profile: any; // The other user's profile
}

export function useFriends() {
  const [friends, setFriends] = useState<FriendRecord[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRecord[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { myProfile } = usePresence();
  const supabase = useMemo(() => createClient(), []);
  // Track the user ID as a stable string for dependency arrays
  const myUserId = myProfile?.id ?? null;

  const fetchFriendsAndRequests = useCallback(async () => {
    if (!myUserId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('friends')
      .select('*, sender:profile!friends_user_id_fkey(*), receiver:profile!friends_friend_id_fkey(*)')
      .or(`user_id.eq.${myUserId},friend_id.eq.${myUserId}`);

    if (error) {
      console.error('Error fetching friends:', error);
      setLoading(false);
      return;
    }

    const allRecords = data || [];
    
    const accepted = allRecords
      .filter(r => r.status === 'accepted')
      .map(r => ({
        ...r,
        profile: r.user_id === myUserId ? r.receiver : r.sender
      }));
    setFriends(accepted);

    const pending = allRecords
      .filter(r => r.status === 'pending' && r.friend_id === myUserId)
      .map(r => ({
        ...r,
        profile: r.sender
      }));
    setPendingRequests(pending);

    const sent = allRecords
      .filter(r => r.status === 'pending' && r.user_id === myUserId)
      .map(r => r.friend_id);
    setSentRequests(sent);

    setLoading(false);
  }, [myUserId, supabase]);

  useEffect(() => {
    fetchFriendsAndRequests();
  }, [fetchFriendsAndRequests]);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) return [];
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .ilike('username', `%${query}%`)
      .limit(10);
      
    if (error) {
      console.error('Error searching users:', error);
      return [];
    }
    return data || [];
  }, [supabase]);

  const sendRequest = useCallback(async (targetUserId: string) => {
    if (!myUserId) return;
    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: myUserId,
        friend_id: targetUserId,
        status: 'pending'
      });
    if (error) console.error('Error sending friend request:', error);
    await fetchFriendsAndRequests();
  }, [myUserId, supabase, fetchFriendsAndRequests]);

  const acceptRequest = useCallback(async (requestId: string) => {
    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', requestId);
    if (error) console.error('Error accepting friend request:', error);
    await fetchFriendsAndRequests();
  }, [supabase, fetchFriendsAndRequests]);

  const rejectRequest = useCallback(async (requestId: string) => {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', requestId);
    if (error) console.error('Error rejecting friend request:', error);
    await fetchFriendsAndRequests();
  }, [supabase, fetchFriendsAndRequests]);

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    searchUsers,
    sendRequest,
    acceptRequest,
    rejectRequest,
    refresh: fetchFriendsAndRequests
  };
}
