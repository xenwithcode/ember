// frontend/src/hooks/useFriends.ts

import { useState, useEffect, useCallback } from "react";
import { Friend, Invitation, mockFriends } from "@/data/friends";

const STORAGE_KEY = "ember_friends";

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFriends(JSON.parse(stored));
      } else {
        // First time: load mock data
        setFriends(mockFriends);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFriends));
      }
    } catch {
      setFriends(mockFriends);
    }
    setIsLoaded(true);
  }, []);

  const saveFriends = useCallback((updated: Friend[]) => {
    setFriends(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addFriend = useCallback(
    (friend: Omit<Friend, "id" | "invitations" | "addedAt">) => {
      const newFriend: Friend = {
        ...friend,
        id: `f_${Date.now()}`,
        invitations: [],
        addedAt: Date.now(),
      };
      saveFriends([newFriend, ...friends]);
      return newFriend;
    },
    [friends, saveFriends]
  );

  const updateFriend = useCallback(
    (id: string, updates: Partial<Friend>) => {
      saveFriends(friends.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    },
    [friends, saveFriends]
  );

  const deleteFriend = useCallback(
    (id: string) => {
      saveFriends(friends.filter((f) => f.id !== id));
    },
    [friends, saveFriends]
  );

  const sendInvitation = useCallback(
    (friendId: string, invitation: Omit<Invitation, "id" | "sentAt">) => {
      const newInvitation: Invitation = {
        ...invitation,
        id: `i_${Date.now()}`,
        sentAt: Date.now(),
      };

      saveFriends(
        friends.map((f) =>
          f.id === friendId
            ? { ...f, invitations: [...f.invitations, newInvitation] }
            : f
        )
      );
    },
    [friends, saveFriends]
  );

  const updateInvitationStatus = useCallback(
    (friendId: string, invitationId: string, status: Invitation["status"]) => {
      saveFriends(
        friends.map((f) =>
          f.id === friendId
            ? {
                ...f,
                invitations: f.invitations.map((inv) =>
                  inv.id === invitationId ? { ...inv, status } : inv
                ),
              }
            : f
        )
      );
    },
    [friends, saveFriends]
  );

  // Stats
  const stats = {
    total: friends.length,
    totalInvitations: friends.reduce((sum, f) => sum + f.invitations.length, 0),
    accepted: friends.reduce(
      (sum, f) => sum + f.invitations.filter((i) => i.status === "accepted").length,
      0
    ),
    pending: friends.reduce(
      (sum, f) => sum + f.invitations.filter((i) => i.status === "pending").length,
      0
    ),
  };

  // Smart suggestion: friends who match an activity's category
  const suggestFriendsForActivity = useCallback(
    (category: string, tags: string[]) => {
      return friends.filter((f) => {
        const interestMatch = f.interests.some(
          (interest) =>
            category.toLowerCase().includes(interest) ||
            tags.some((t) => t.toLowerCase().includes(interest))
        );
        return interestMatch;
      });
    },
    [friends]
  );

  return {
    friends,
    isLoaded,
    addFriend,
    updateFriend,
    deleteFriend,
    sendInvitation,
    updateInvitationStatus,
    stats,
    suggestFriendsForActivity,
  };
}