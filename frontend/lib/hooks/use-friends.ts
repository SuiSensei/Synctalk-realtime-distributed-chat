import { useState, useCallback, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePresence } from './use-presence';
import { useWebSocket } from '../contexts/websocket-context';

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
  const { sendMessage, subscribe } = useWebSocket();
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

  // Initial fetch
  useEffect(() => {
    fetchFriendsAndRequests();
  }, [fetchFriendsAndRequests]);

  // Subscribe to real-time friend events via WebSocket
  useEffect(() => {
    const unsubReceived = subscribe('friend_request_received', () => {
      fetchFriendsAndRequests();
    });

    const unsubSent = subscribe('friend_request_sent', () => {
      fetchFriendsAndRequests();
    });

    const unsubAccepted = subscribe('friend_request_accepted', () => {
      fetchFriendsAndRequests();
    });

    const unsubRejected = subscribe('friend_request_rejected', () => {
      fetchFriendsAndRequests();
    });

    return () => {
      unsubReceived();
      unsubSent();
      unsubAccepted();
      unsubRejected();
    };
  }, [subscribe, fetchFriendsAndRequests]);

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

  // Send friend request through WebSocket (so server can notify the recipient in real time)
  const sendRequest = useCallback(async (targetUserId: string) => {
    if (!myUserId) return;
    sendMessage({ type: 'send_friend_request', targetUserId });
  }, [myUserId, sendMessage]);

  // Accept/reject through WebSocket (so server can notify the sender in real time)
  const acceptRequest = useCallback(async (requestId: string) => {
    sendMessage({ type: 'respond_friend_request', requestId, action: 'accept' });
  }, [sendMessage]);

  const rejectRequest = useCallback(async (requestId: string) => {
    sendMessage({ type: 'respond_friend_request', requestId, action: 'reject' });
  }, [sendMessage]);

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
