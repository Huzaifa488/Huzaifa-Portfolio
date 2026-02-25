/**
 * Supabase Database Types
 * Mirrors the exact schema defined in supabase/schema.sql
 * Format matches Supabase CLI generated types for JS client v2.49+
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string
          name:       string
          title:      string
          bio:        string
          email:      string
          github:     string | null
          linkedin:   string | null
          resume_url: string | null
          updated_at: string
        }
        Insert: {
          id?:         string
          name:        string
          title:       string
          bio:         string
          email:       string
          github?:     string | null
          linkedin?:   string | null
          resume_url?: string | null
          updated_at?: string
        }
        Update: {
          id?:         string
          name?:       string
          title?:      string
          bio?:        string
          email?:      string
          github?:     string | null
          linkedin?:   string | null
          resume_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id:           string
          title:        string
          description:  string
          tech_stack:   string[]
          category:     string
          image_url:    string | null
          github_url:   string | null
          featured:     boolean
          is_published: boolean
          created_at:   string
        }
        Insert: {
          id?:           string
          title:         string
          description:   string
          tech_stack:    string[]
          category:      string
          image_url?:    string | null
          github_url?:   string | null
          featured?:     boolean
          is_published?: boolean
          created_at?:   string
        }
        Update: {
          id?:           string
          title?:        string
          description?:  string
          tech_stack?:   string[]
          category?:     string
          image_url?:    string | null
          github_url?:   string | null
          featured?:     boolean
          is_published?: boolean
          created_at?:   string
        }
        Relationships: []
      }
      skills: {
        Row: {
          id:         string
          category:   string
          name:       string
          sort_order: number
        }
        Insert: {
          id?:         string
          category:    string
          name:        string
          sort_order?: number
        }
        Update: {
          id?:         string
          category?:   string
          name?:       string
          sort_order?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          id:         string
          name:       string
          email:      string
          message:    string
          is_read:    boolean
          created_at: string
        }
        Insert: {
          id?:         string
          name:        string
          email:       string
          message:     string
          is_read?:    boolean
          created_at?: string
        }
        Update: {
          id?:         string
          name?:       string
          email?:      string
          message?:    string
          is_read?:    boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ── Convenience type aliases ──────────────────────────────────────
export type Profile  = Database['public']['Tables']['profiles']['Row']
export type Project  = Database['public']['Tables']['projects']['Row']
export type Skill    = Database['public']['Tables']['skills']['Row']
export type Message  = Database['public']['Tables']['messages']['Row']

export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']
export type SkillInsert   = Database['public']['Tables']['skills']['Insert']
export type SkillUpdate   = Database['public']['Tables']['skills']['Update']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// ── Grouped skill structure used in the UI ────────────────────────
export interface SkillCategory {
  category: string
  skills:   Skill[]
}

// ── Contact form payload ──────────────────────────────────────────
export interface ContactFormData {
  name:    string
  email:   string
  message: string
}

// ── API response wrapper ──────────────────────────────────────────
export interface ApiResponse<T = void> {
  data?:    T
  error?:   string
  success:  boolean
}
