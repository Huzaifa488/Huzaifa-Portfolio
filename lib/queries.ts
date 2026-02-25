/**
 * Data access layer — all Supabase queries are centralised here.
 * Server-side functions use the server client; client-side hooks
 * call the browser client directly.
 */
import { createClient } from '@/lib/supabase/server'
import type {
  Profile,
  Project,
  Skill,
  SkillCategory,
  Message,
} from '@/types/database'

// ── Profile ───────────────────────────────────────────────────────
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('[getProfile]', error.message)
    return null
  }
  return data
}

// ── Projects ──────────────────────────────────────────────────────
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getPublishedProjects]', error.message)
    return []
  }
  return data ?? []
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getFeaturedProjects]', error.message)
    return []
  }
  return data ?? []
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[getProjectById]', error.message)
    return null
  }
  return data
}

// ── Skills ────────────────────────────────────────────────────────
export async function getSkillsGrouped(): Promise<SkillCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category')
    .order('sort_order')

  if (error) {
    console.error('[getSkillsGrouped]', error.message)
    return []
  }

  const skills: Skill[] = data ?? []

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return Object.entries(grouped).map(([category, skills]) => ({
    category,
    skills,
  }))
}

// ── Messages (admin-only — protected by RLS) ──────────────────────
export async function getMessages(): Promise<Message[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getMessages]', error.message)
    return []
  }
  return data ?? []
}

// ── Admin — All projects (including unpublished) ──────────────────
export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getAllProjects]', error.message)
    return []
  }
  return data ?? []
}

// ── Admin — All skills ────────────────────────────────────────────
export async function getAllSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category')
    .order('sort_order')

  if (error) {
    console.error('[getAllSkills]', error.message)
    return []
  }
  return data ?? []
}
