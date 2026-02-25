-- ============================================================
-- Row Level Security (RLS) Policies
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ── Enable RLS on all tables ──────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- profiles — public read / authenticated write
-- ============================================================
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_auth_update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- projects — public read published only / authenticated full control
-- ============================================================
CREATE POLICY "projects_public_read_published"
  ON public.projects FOR SELECT
  USING (is_published = true);

-- Authenticated users (admin) can read ALL projects including unpublished
CREATE POLICY "projects_auth_read_all"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "projects_auth_insert"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "projects_auth_update"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "projects_auth_delete"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- skills — public read / authenticated full control
-- ============================================================
CREATE POLICY "skills_public_read"
  ON public.skills FOR SELECT
  USING (true);

CREATE POLICY "skills_auth_insert"
  ON public.skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "skills_auth_update"
  ON public.skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "skills_auth_delete"
  ON public.skills FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- messages — public insert (contact form) / authenticated read + delete
-- ============================================================

-- Anyone can submit a contact message
CREATE POLICY "messages_public_insert"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can read messages
CREATE POLICY "messages_auth_read"
  ON public.messages FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admin can update messages (e.g., mark as read)
CREATE POLICY "messages_auth_update"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated admin can delete messages
CREATE POLICY "messages_auth_delete"
  ON public.messages FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Storage bucket for project images
-- Run this after creating a bucket named 'project-images'
-- in Supabase Storage dashboard
-- ============================================================

-- Allow public read access to project images
CREATE POLICY "project_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Allow authenticated users to upload images
CREATE POLICY "project_images_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- Allow authenticated users to update/replace images
CREATE POLICY "project_images_auth_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

-- Allow authenticated users to delete images
CREATE POLICY "project_images_auth_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
