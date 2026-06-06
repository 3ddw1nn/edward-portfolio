-- Neon schema for portfolio blog
-- Run once: psql $DATABASE_URL -f neon/schema.sql

-- ── posts ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS posts (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text        NOT NULL UNIQUE,
  title      text        NOT NULL,
  excerpt    text        NOT NULL DEFAULT '',
  content    text        NOT NULL,
  tags       text[]      NOT NULL DEFAULT '{}',
  date       text        NOT NULL,
  read_time  text        NOT NULL DEFAULT '5 min read',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_date_idx       ON posts (date DESC);
CREATE INDEX IF NOT EXISTS posts_updated_at_idx ON posts (updated_at DESC);

-- Auto-bump updated_at on edits; skip when caller supplies a new value explicitly.
CREATE OR REPLACE FUNCTION set_posts_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF new.updated_at IS NOT DISTINCT FROM old.updated_at THEN
    new.updated_at := now();
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS posts_set_updated_at ON posts;
CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION set_posts_updated_at();

-- ── comments ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS comments (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug      text        NOT NULL,
  name           text,
  body           text        NOT NULL DEFAULT '',
  gif_url        text,
  reply_to_id    uuid        REFERENCES comments (id) ON DELETE SET NULL,
  reply_to_name  text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_post_slug_idx ON comments (post_slug);

-- ── comment_likes ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS comment_likes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  uuid        NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
  visitor_id  uuid        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comment_likes_comment_visitor_unique UNIQUE (comment_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS comment_likes_comment_id_idx ON comment_likes (comment_id);

-- ── post_likes ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS post_likes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug   text        NOT NULL,
  visitor_id  uuid        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT post_likes_slug_visitor_unique UNIQUE (post_slug, visitor_id)
);

CREATE INDEX IF NOT EXISTS post_likes_post_slug_idx ON post_likes (post_slug);
