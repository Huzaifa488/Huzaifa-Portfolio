'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, Upload, X, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const projectSchema = z.object({
  title:        z.string().min(3, 'Title must be at least 3 characters'),
  description:  z.string().min(20, 'Description must be at least 20 characters'),
  tech_stack:   z.string().min(1, 'Enter at least one technology'),
  category:     z.string().min(2, 'Category is required'),
  github_url:   z.string().url().optional().or(z.literal('')),
  featured:     z.boolean(),
  is_published: z.boolean(),
})

type ProjectFormData = z.infer<typeof projectSchema>

const isNew = (id: string) => id === 'new'

export default function ProjectEditorPage() {
  const { id }    = useParams<{ id: string }>()
  const router    = useRouter()
  const supabase  = createClient()
  const creating  = isNew(id)

  const [loading,       setLoading]       = useState(!creating)
  const [imageUrl,      setImageUrl]      = useState<string | null>(null)
  const [uploadingImg,  setUploadingImg]  = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { featured: false, is_published: true },
  })

  const fetchProject = useCallback(async () => {
    if (creating) return
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
    if (error || !data) { toast.error('Project not found.'); router.push('/admin/projects'); return }
    reset({
      title:        data.title,
      description:  data.description,
      tech_stack:   data.tech_stack.join(', '),
      category:     data.category,
      github_url:   data.github_url ?? '',
      featured:     data.featured,
      is_published: data.is_published,
    })
    setImageUrl(data.image_url)
    setLoading(false)
  }, [id, creating, supabase, reset, router])

  useEffect(() => { fetchProject() }, [fetchProject])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.')
      return
    }

    setUploadingImg(true)
    const ext      = file.name.split('.').pop()
    const filePath = `projects/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      toast.error('Image upload failed: ' + uploadError.message)
      setUploadingImg(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    setImageUrl(publicUrl)
    setUploadingImg(false)
    toast.success('Image uploaded.')
  }

  const onSubmit = async (data: ProjectFormData) => {
    const payload = {
      title:        data.title,
      description:  data.description,
      tech_stack:   data.tech_stack.split(',').map((t) => t.trim()).filter(Boolean),
      category:     data.category,
      github_url:   data.github_url || null,
      featured:     data.featured,
      is_published: data.is_published,
      image_url:    imageUrl,
    }

    let error
    if (creating) {
      ;({ error } = await supabase.from('projects').insert(payload))
    } else {
      ;({ error } = await supabase.from('projects').update(payload).eq('id', id))
    }

    if (error) { toast.error('Save failed: ' + error.message); return }

    toast.success(creating ? 'Project created.' : 'Project updated.')
    router.push('/admin/projects')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="btn-ghost p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {creating ? 'New Project' : 'Edit Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Main fields */}
        <div className="card card-padding space-y-5">
          <div>
            <label className="label">Title</label>
            <input type="text" className={cn('input-field', errors.title && 'border-red-400')} {...register('title')} />
            {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea rows={6} className={cn('input-field resize-none', errors.description && 'border-red-400')} {...register('description')} />
            {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label">Tech Stack <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input type="text" placeholder="Java, Android SDK, Firebase" className={cn('input-field', errors.tech_stack && 'border-red-400')} {...register('tech_stack')} />
            {errors.tech_stack && <p className="mt-1.5 text-xs text-red-500">{errors.tech_stack.message}</p>}
          </div>

          <div>
            <label className="label">Category</label>
            <select className={cn('input-field', errors.category && 'border-red-400')} {...register('category')}>
              <option value="">Select category…</option>
              {['Android Development', 'Machine Learning', 'Augmented Reality', 'Web Development', 'Other'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category.message}</p>}
          </div>

          <div>
            <label className="label">GitHub URL (optional)</label>
            <input type="url" placeholder="https://github.com/..." className={cn('input-field', errors.github_url && 'border-red-400')} {...register('github_url')} />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-8 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary-600" {...register('is_published')} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary-600" {...register('featured')} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
            </label>
          </div>
        </div>

        {/* Image upload */}
        <div className="card card-padding space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Project Image</h3>

          {imageUrl && (
            <div className="relative rounded-lg overflow-hidden h-44 bg-gray-100 dark:bg-gray-800">
              <Image src={imageUrl} alt="Project preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/90 dark:bg-gray-900/90
                           text-gray-700 hover:text-red-600 shadow transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <label className={cn(
            'flex items-center gap-2 cursor-pointer',
            'btn-secondary w-fit text-sm',
            uploadingImg && 'opacity-50 pointer-events-none'
          )}>
            {uploadingImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingImg ? 'Uploading…' : imageUrl ? 'Replace Image' : 'Upload Image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <p className="text-xs text-gray-400 dark:text-gray-600">PNG, JPG, WebP — max 5 MB</p>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/projects" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={isSubmitting || (!isDirty && !creating)} className="btn-primary">
            {isSubmitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Save className="w-4 h-4" /> {creating ? 'Create Project' : 'Save Changes'}</>
            }
          </button>
        </div>
      </form>
    </div>
  )
}
