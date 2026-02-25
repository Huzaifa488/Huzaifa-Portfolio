-- ============================================================
-- Portfolio Database Schema
-- Run this in Supabase SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── profiles ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  bio         TEXT NOT NULL,
  email       TEXT NOT NULL,
  github      TEXT,
  linkedin    TEXT,
  resume_url  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── projects ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT    NOT NULL,
  description  TEXT    NOT NULL,
  tech_stack   TEXT[]  NOT NULL DEFAULT '{}',
  category     TEXT    NOT NULL,
  image_url    TEXT,
  github_url   TEXT,
  featured     BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── skills ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skills (
  id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  category   TEXT    NOT NULL,
  name       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ── messages ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Seed Data — initial profile, projects, and skills
-- ============================================================

-- Profile
INSERT INTO public.profiles (name, title, bio, email, github, linkedin)
VALUES (
  'Huzaifa Nadeem',
  'Software Developer | AI & Mobile Systems',
  'Final-year Computer Science student with hands-on experience building Android applications, machine learning pipelines, and full-stack web systems. Passionate about solving real-world problems through clean, scalable software. Currently seeking software development roles and graduate program opportunities.',
  'huzaifanadeem@example.com',
  'https://github.com/huzaifanadeem',
  'https://linkedin.com/in/huzaifanadeem'
)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO public.projects (title, description, tech_stack, category, github_url, featured, is_published)
VALUES
(
  'Auto Course Registration System',
  'Developed an Android application that automates the university course registration process. The system monitors seat availability in real-time and registers students automatically when a slot opens, eliminating the need for manual refreshing. Integrated with the university portal API and implemented background services to ensure reliability.',
  ARRAY['Java', 'Android SDK', 'Firebase', 'REST API', 'Room Database'],
  'Android Development',
  'https://github.com/huzaifanadeem/auto-course-registration',
  true,
  true
),
(
  'Sentiment Analysis on Customer Reviews',
  'Built a machine learning pipeline to classify customer product reviews as positive, negative, or neutral. Preprocessed a dataset of 50,000+ reviews using NLP techniques including tokenization, stopword removal, and TF-IDF vectorization. Achieved 89% accuracy using an ensemble of Logistic Regression and SVM classifiers.',
  ARRAY['Python', 'Scikit-learn', 'NLTK', 'Pandas', 'NumPy', 'Matplotlib'],
  'Machine Learning',
  'https://github.com/huzaifanadeem/sentiment-analysis',
  true,
  true
),
(
  'AR Shopping Application',
  'Final Year Project — An augmented reality mobile application that allows users to visualise furniture and home décor products in their physical space before purchasing. Built using ARCore for 3D object placement with 6DoF tracking, integrated with an e-commerce backend for real-time product catalog browsing.',
  ARRAY['Java', 'ARCore', 'Android SDK', 'OpenGL ES', 'Firebase', 'REST API'],
  'Augmented Reality',
  'https://github.com/huzaifanadeem/ar-shopping',
  true,
  true
);

-- Skills
INSERT INTO public.skills (category, name, sort_order) VALUES
-- Programming Languages
('Programming Languages', 'Java',       1),
('Programming Languages', 'Python',     2),
('Programming Languages', 'TypeScript', 3),
('Programming Languages', 'JavaScript', 4),
('Programming Languages', 'C++',        5),
('Programming Languages', 'SQL',        6),
-- Mobile Development
('Mobile Development', 'Android SDK',  1),
('Mobile Development', 'ARCore',       2),
('Mobile Development', 'Firebase',     3),
('Mobile Development', 'Room DB',      4),
('Mobile Development', 'Retrofit',     5),
-- Machine Learning
('Machine Learning', 'Scikit-learn',   1),
('Machine Learning', 'Pandas',         2),
('Machine Learning', 'NumPy',          3),
('Machine Learning', 'NLTK',           4),
('Machine Learning', 'Matplotlib',     5),
-- Web & Full-Stack
('Web & Full-Stack', 'Next.js',        1),
('Web & Full-Stack', 'React',          2),
('Web & Full-Stack', 'Tailwind CSS',   3),
('Web & Full-Stack', 'Supabase',       4),
('Web & Full-Stack', 'PostgreSQL',     5),
-- Tools & DevOps
('Tools & DevOps', 'Git & GitHub',     1),
('Tools & DevOps', 'Android Studio',   2),
('Tools & DevOps', 'VS Code',          3),
('Tools & DevOps', 'Postman',          4),
('Tools & DevOps', 'Vercel',           5),
('Tools & DevOps', 'Figma',            6);
