-- =============================================================================
-- SyncTalk Database Schema
-- =============================================================================
-- This file documents the complete Supabase database schema for reference.
-- WARNING: This schema is for context only and is not meant to be run directly.
-- Table order and constraints may not be valid for sequential execution.
-- All tables already exist in the Supabase project.
-- =============================================================================
-- Last updated: 2026-05-12
-- Supabase project: amzeremahjjqxkyvsupb.supabase.co
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: gender
-- Purpose: Lookup table for gender options used by profiles.
-- -----------------------------------------------------------------------------
CREATE TABLE public.gender (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT gender_pkey PRIMARY KEY (id)
);

-- -----------------------------------------------------------------------------
-- Table: social_link
-- Purpose: Stores social media links (Facebook, Instagram, Email, etc.)
--          that can be associated with a user profile.
-- -----------------------------------------------------------------------------
CREATE TABLE public.social_link (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  link text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT social_link_pkey PRIMARY KEY (id)
);

-- -----------------------------------------------------------------------------
-- Table: profile
-- Purpose: Extends Supabase auth.users with application-specific user data.
--          The `id` column references auth.users(id) — one profile per user.
-- -----------------------------------------------------------------------------
CREATE TABLE public.profile (
  id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  username text NOT NULL UNIQUE,
  gender_uuid uuid,
  social_link_id uuid,
  phone character varying,
  suffix text,
  about text NOT NULL DEFAULT ''::text,
  avatar_url text NOT NULL DEFAULT ''::text,
  last_active timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_online boolean NOT NULL DEFAULT false,
  status character varying NOT NULL DEFAULT 'available'::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT profile_pkey PRIMARY KEY (id),
  CONSTRAINT profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profile_gender_uuid_fkey FOREIGN KEY (gender_uuid) REFERENCES public.gender(id),
  CONSTRAINT profile_social_link_id_fkey FOREIGN KEY (social_link_id) REFERENCES public.social_link(id)
);

-- -----------------------------------------------------------------------------
-- Table: user_status
-- Purpose: Tracks real-time presence status for each user (available, away, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE public.user_status (
  user_id uuid NOT NULL,
  status character varying NOT NULL DEFAULT 'available'::character varying,
  last_active timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_status_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_status_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id)
);

-- -----------------------------------------------------------------------------
-- Table: friends
-- Purpose: Manages friend/contact relationships between users.
--          Status can be 'pending', 'accepted', 'blocked', etc.
-- -----------------------------------------------------------------------------
CREATE TABLE public.friends (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  friend_id uuid NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT friends_pkey PRIMARY KEY (id),
  CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id),
  CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.profile(id)
);

-- -----------------------------------------------------------------------------
-- Table: room
-- Purpose: Chat rooms (group chats). Can be public or private.
-- -----------------------------------------------------------------------------
CREATE TABLE public.room (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT ''::text,
  owner_id uuid NOT NULL,
  is_private boolean NOT NULL DEFAULT false,
  avatar_url text NOT NULL DEFAULT ''::text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT room_pkey PRIMARY KEY (id),
  CONSTRAINT room_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profile(id)
);

-- -----------------------------------------------------------------------------
-- Table: room_member
-- Purpose: Join table for room membership. Composite primary key on (room_id, user_id).
--          Role can be 'member', 'admin', 'owner', etc.
-- -----------------------------------------------------------------------------
CREATE TABLE public.room_member (
  room_id uuid NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role character varying NOT NULL DEFAULT 'member'::character varying,
  CONSTRAINT room_member_pkey PRIMARY KEY (room_id, user_id),
  CONSTRAINT room_member_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(id),
  CONSTRAINT room_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id)
);

-- -----------------------------------------------------------------------------
-- Table: message
-- Purpose: All chat messages (group and direct). References a room and sender.
--          Supports replies via parent_message_id, edit tracking, and soft delete.
-- -----------------------------------------------------------------------------
CREATE TABLE public.message (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid NOT NULL,
  room_id uuid NOT NULL,
  recipient_id uuid,
  location text NOT NULL DEFAULT ''::text,
  is_deleted boolean NOT NULL DEFAULT false,
  is_edited boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at timestamp without time zone,
  type character varying NOT NULL DEFAULT 'text'::character varying,
  parent_message_id uuid,
  CONSTRAINT message_pkey PRIMARY KEY (id),
  CONSTRAINT message_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id),
  CONSTRAINT message_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(id),
  CONSTRAINT message_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profile(id),
  CONSTRAINT message_parent_message_id_fkey FOREIGN KEY (parent_message_id) REFERENCES public.message(id)
);

-- -----------------------------------------------------------------------------
-- Table: direct_message
-- Purpose: Maps a message to a direct (1:1) conversation between two users.
--          The actual message content lives in the `message` table.
-- -----------------------------------------------------------------------------
CREATE TABLE public.direct_message (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  message_id uuid NOT NULL UNIQUE,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT direct_message_pkey PRIMARY KEY (id),
  CONSTRAINT direct_message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profile(id),
  CONSTRAINT direct_message_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profile(id),
  CONSTRAINT direct_message_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.message(id)
);

-- -----------------------------------------------------------------------------
-- Table: message_attachment
-- Purpose: File attachments linked to a message (images, documents, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE public.message_attachment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL,
  name text NOT NULL,
  link text NOT NULL,
  file_type character varying,
  file_size integer,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT message_attachment_pkey PRIMARY KEY (id),
  CONSTRAINT message_attachment_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.message(id)
);

-- -----------------------------------------------------------------------------
-- Table: message_reaction
-- Purpose: Emoji reactions on messages. Each row is one user's reaction.
-- -----------------------------------------------------------------------------
CREATE TABLE public.message_reaction (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  emoji text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT message_reaction_pkey PRIMARY KEY (id),
  CONSTRAINT message_reaction_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.message(id),
  CONSTRAINT message_reaction_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id)
);

-- -----------------------------------------------------------------------------
-- Table: message_read
-- Purpose: Tracks read/unread status per message per user.
--          Status is constrained to 'read' or 'unread'.
-- -----------------------------------------------------------------------------
CREATE TABLE public.message_read (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'unread'::text CHECK (status = ANY (ARRAY['read'::text, 'unread'::text])),
  read_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT message_read_pkey PRIMARY KEY (id),
  CONSTRAINT message_read_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.message(id),
  CONSTRAINT message_read_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id)
);

-- =============================================================================
-- Entity Relationship Summary
-- =============================================================================
--
--   auth.users ──1:1──> profile ──1:N──> message
--                  │                │         │
--                  │                │         ├──> message_attachment
--                  │                │         ├──> message_reaction
--                  │                │         ├──> message_read
--                  │                │         └──> direct_message
--                  │                │
--                  │                ├──1:N──> friends
--                  │                ├──1:1──> user_status
--                  │                ├──N:1──> gender
--                  │                └──N:1──> social_link
--                  │
--                  └──M:N──> room (via room_member)
--
-- =============================================================================
