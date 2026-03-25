'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, User, Upload, Trash2, Camera } from 'lucide-react'
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
  const supabase            = createClient()
  const [loading,     setLoading]     = useState(true)
  const [profile,     setProfile]     = useState<Profile | null>(null)
  const [avatarUrl,   setAvatarUrl]   = useState<string | null>(null)
  const [uploading,   setUploading]   = useState(false)
  const [removing,    setRemoving]    = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setAvatarUrl(data?.avatar_url ?? null)
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

  /* ── Photo upload ─────────────────────────────────────────────── */
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile?.id) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      toast.error('Please select a JPG, PNG, WEBP, or GIF file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be under 5 MB.')
      return
    }

    setUploading(true)
    try {
      const ext      = file.name.split('.').pop()
      const filePath = `avatars/${profile.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)

      if (dbError) throw dbError

      setAvatarUrl(publicUrl)
      setProfile((prev) => prev ? { ...prev, avatar_url: publicUrl } : prev)
      toast.success('Photo updated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.'
      toast.error(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ── Photo remove ─────────────────────────────────────────────── */
  const handlePhotoRemove = async () => {
    if (!profile?.id || !avatarUrl) return
    setRemoving(true)
    try {
      /* Try to delete from storage (non-fatal if it fails) */
      const segments = avatarUrl.split('/avatars/')
      if (segments.length === 2) {
        await supabase.storage
          .from('portfolio')
          .remove([`avatars/${segments[1]}`])
      }

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', profile.id)

      if (error) throw error

      setAvatarUrl(null)
      setProfile((prev) => prev ? { ...prev, avatar_url: null } : prev)
      toast.success('Photo removed.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Remove failed.'
      toast.error(msg)
    } finally {
      setRemoving(false)
    }
  }

  /* ── Profile form submit ──────────────────────────────────────── */
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

  /* ── Derived initials for fallback avatar ─────────────────────── */
  const initials = (profile?.name ?? 'HN')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

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
        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30
                        flex items-center justify-center">
          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your public-facing information.
          </p>
        </div>
      </div>

      {/* ── Photo Section ─────────────────────────────────────────── */}
      <div className="card card-padding">
        <div className="flex items-center gap-3 mb-5">
          <Camera className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
            Profile Photo
          </h2>
        </div>

        <div className="flex items-center gap-6">
          {/* Avatar preview */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0
                          border-2 border-gray-200 dark:border-gray-700 shadow-md">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile photo"
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                   style={{
                     background: 'linear-gradient(135deg, #2563eb, #7c3aed, #ec4899)',
                   }}>
                <span className="text-2xl font-extrabold text-white select-none">
                  {initials}
                </span>
              </div>
            )}

            {/* Uploading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JPG, PNG, WEBP or GIF · max 5 MB
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || removing}
                className="btn-secondary text-sm px-4 py-2 gap-2"
              >
                {uploading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
                ) : (
                  <><Upload className="w-3.5 h-3.5" /> {avatarUrl ? 'Change Photo' : 'Upload Photo'}</>
                )}
              </button>

              {/* Remove button — only shown when photo exists */}
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handlePhotoRemove}
                  disabled={uploading || removing}
                  className="btn-danger text-sm px-4 py-2 gap-2"
                >
                  {removing ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Removing…</>
                  ) : (
                    <><Trash2 className="w-3.5 h-3.5" /> Remove</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>

      {/* ── Profile Form ──────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="card card-padding space-y-5">
        <Field label="Full Name" error={errors.name?.message}>
          <input
            type="text"
            className={cn('input-field', errors.name && 'border-red-400')}
            {...register('name')}
          />
        </Field>

        <Field label="Professional Title" error={errors.title?.message}>
          <input
            type="text"
            className={cn('input-field', errors.title && 'border-red-400')}
            {...register('title')}
          />
        </Field>

        <Field label="Bio / Summary" error={errors.bio?.message}>
          <textarea
            rows={5}
            className={cn('input-field resize-none', errors.bio && 'border-red-400')}
            {...register('bio')}
          />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            className={cn('input-field', errors.email && 'border-red-400')}
            {...register('email')}
          />
        </Field>

        <Field label="GitHub URL (optional)" error={errors.github?.message}>
          <input
            type="url"
            placeholder="https://github.com/username"
            className={cn('input-field', errors.github && 'border-red-400')}
            {...register('github')}
          />
        </Field>

        <Field label="LinkedIn URL (optional)" error={errors.linkedin?.message}>
          <input
            type="url"
            placeholder="https://linkedin.com/in/username"
            className={cn('input-field', errors.linkedin && 'border-red-400')}
            {...register('linkedin')}
          />
        </Field>

        <Field label="Resume URL (optional)" error={errors.resume_url?.message}>
          <input
            type="url"
            placeholder="https://..."
            className={cn('input-field', errors.resume_url && 'border-red-400')}
            {...register('resume_url')}
          />
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
