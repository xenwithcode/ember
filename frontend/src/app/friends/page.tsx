"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  UserPlus,
  Mail,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import FriendCard from "@/components/friends/FriendCard";
import AddFriendModal from "@/components/friends/AddFriendModal";
import InviteFriendModal from "@/components/friends/InviteFriendModal";
import { useFriends } from "@/hooks/useFriends";
import { Friend } from "@/data/friends";

export default function FriendsPage() {
  const {
    friends,
    stats,
    addFriend,
    deleteFriend,
    sendInvitation,
  } = useFriends();

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [inviteForFriend, setInviteForFriend] = useState<Friend | null>(null);

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="page-section">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-coffee-800 text-2xl">
                Your Inner Circle
              </h1>
              <p className="text-sm text-warm-light">
                People you trust. People you want beside you.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-in-up stagger-1">
          <div className="card-static p-4 text-center">
            <Users className="w-5 h-5 text-terracotta-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-terracotta-600">{stats.total}</p>
            <p className="text-xs text-warm-gray">Friends</p>
          </div>
          <div className="card-static p-4 text-center">
            <Mail className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalInvitations}</p>
            <p className="text-xs text-warm-gray">Invitations sent</p>
          </div>
          <div className="card-static p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            <p className="text-xs text-warm-gray">Accepted</p>
          </div>
          <div className="card-static p-4 text-center">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-xs text-warm-gray">Pending</p>
          </div>
        </div>

        {/* Search + Add button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up stagger-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or tag..."
              className="input-warm pl-10"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Friend
          </button>
        </div>

        {/* Friends list */}
        {filteredFriends.length === 0 ? (
          <div className="card-static p-12 text-center animate-fade-in-up">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-serif text-lg font-medium text-coffee-800 mb-2">
              {search ? "No friends match your search" : "Your inner circle is empty"}
            </h3>
            <p className="text-sm text-warm-gray max-w-sm mx-auto mb-6">
              {search
                ? "Try a different search term."
                : "Add people you trust. These are the ones you'll invite to real-world adventures."}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Friend
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onInvite={() => setInviteForFriend(friend)}
                onDelete={() => deleteFriend(friend.id)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddFriendModal
            onClose={() => setShowAddModal(false)}
            onSave={(friendData) => {
              addFriend(friendData);
              setShowAddModal(false);
            }}
          />
        )}

        {inviteForFriend && (
          <InviteFriendModal
            friend={inviteForFriend}
            onClose={() => setInviteForFriend(null)}
            onSend={(invitation) => {
              sendInvitation(inviteForFriend.id, invitation);
              setInviteForFriend(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}