'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, User } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '@/types/database'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name:       z.string().min(2),
  title:      z.string().min(5),
  bio:        z.string().min(20).max(1000),
  email:      z.string().email(),
  github:     z.string().url().optional().or(z.literal('')),
  linkedin:   z.string().url().optional().or(z.literal('')),
  resume_url: z.string().url().optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function AdminProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').limit(1).single()
      setProfile(data)
      if (data) {
        reset({
          name:       data.name,
          title:      data.title,
          bio:        data.bio,
          email:      data.email,
          github:     data.github     ?? '',
          linkedin:   data.linkedin   ?? '',
          resume_url: data.resume_url ?? '',
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase, reset])

  const onSubmit = async (data: ProfileFormData) => {
    const payload = {
      ...data,
      github:     data.github     || null,
      linkedin:   data.linkedin   || null,
      resume_url: data.resume_url || null,
    }

    let error
    if (profile?.id) {
      ;({ error } = await supabase.from('profiles').update(payload).eq('id', profile.id))
    } else {
      ;({ error } = await supabase.from('profiles').insert(payload))
    }

    if (error) {
      toast.error('Failed to save profile: ' + error.message)
    } else {
      toast.success('Profile updated successfully.')
      reset(data)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your public-facing information.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="card card-padding space-y-5">
        <Field label="Full Name" error={errors.name?.message}>
          <input type="text" className={cn('input-field', errors.name && 'border-red-400')} {...register('name')} />
        </Field>

        <Field label="Professional Title" error={errors.title?.message}>
          <input type="text" className={cn('input-field', errors.title && 'border-red-400')} {...register('title')} />
        </Field>

        <Field label="Bio / Summary" error={errors.bio?.message}>
          <textarea rows={5} className={cn('input-field resize-none', errors.bio && 'border-red-400')} {...register('bio')} />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={cn('input-field', errors.email && 'border-red-400')} {...register('email')} />
        </Field>

        <Field label="GitHub URL (optional)" error={errors.github?.message}>
          <input type="url" placeholder="https://github.com/username" className={cn('input-field', errors.github && 'border-red-400')} {...register('github')} />
        </Field>

        <Field label="LinkedIn URL (optional)" error={errors.linkedin?.message}>
          <input type="url" placeholder="https://linkedin.com/in/username" className={cn('input-field', errors.linkedin && 'border-red-400')} {...register('linkedin')} />
        </Field>

        <Field label="Resume URL (optional)" error={errors.resume_url?.message}>
          <input type="url" placeholder="https://..." className={cn('input-field', errors.resume_url && 'border-red-400')} {...register('resume_url')} />
        </Field>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="btn-primary"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label, error, children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}
