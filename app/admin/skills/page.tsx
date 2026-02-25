'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Loader2, Cpu } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Skill, SkillCategory } from '@/types/database'
import { cn } from '@/lib/utils'

const skillSchema = z.object({
  category:   z.string().min(2, 'Category required'),
  name:       z.string().min(1, 'Name required').max(60),
  sort_order: z.coerce.number().int().default(0),
})
type SkillFormData = z.infer<typeof skillSchema>

const PRESET_CATEGORIES = [
  'Programming Languages',
  'Mobile Development',
  'Machine Learning',
  'Web & Full-Stack',
  'Tools & DevOps',
]

export default function AdminSkillsPage() {
  const supabase = createClient()
  const [groups, setGroups]   = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({ resolver: zodResolver(skillSchema) })

  const fetchSkills = useCallback(async () => {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('category')
      .order('sort_order')

    const skills: Skill[] = data ?? []
    const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
      if (!acc[s.category]) acc[s.category] = []
      acc[s.category].push(s)
      return acc
    }, {})

    setGroups(
      Object.entries(grouped).map(([category, skills]) => ({ category, skills }))
    )
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchSkills() }, [fetchSkills])

  const addSkill = async (data: SkillFormData) => {
    const { error } = await supabase.from('skills').insert(data)
    if (error) { toast.error('Failed to add skill.'); return }
    toast.success(`"${data.name}" added.`)
    reset()
    fetchSkills()
  }

  const deleteSkill = async (id: string) => {
    if (!window.confirm('Delete this skill?')) return
    setDeleting(id)
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) { toast.error('Delete failed.') }
    else { toast.success('Skill deleted.') }
    setDeleting(null)
    fetchSkills()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your technical skills by category.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add skill form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit(addSkill)} className="card card-padding space-y-4 sticky top-6">
            <h2 className="font-semibold text-gray-900 dark:text-white">Add New Skill</h2>

            <div>
              <label className="label">Category</label>
              <select className={cn('input-field', errors.category && 'border-red-400')} {...register('category')}>
                <option value="">Select or type…</option>
                {PRESET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div>
              <label className="label">Skill Name</label>
              <input
                type="text"
                placeholder="e.g. React, Python, ARCore"
                className={cn('input-field', errors.name && 'border-red-400')}
                {...register('name')}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Sort Order <span className="text-gray-400 font-normal">(lower = first)</span></label>
              <input type="number" min={0} defaultValue={0} className="input-field" {...register('sort_order')} />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</>
                : <><Plus className="w-4 h-4" /> Add Skill</>
              }
            </button>
          </form>
        </div>

        {/* Skill groups */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : groups.length === 0 ? (
            <div className="card card-padding text-center py-12 text-gray-400 dark:text-gray-600">
              No skills yet. Add your first one.
            </div>
          ) : (
            groups.map(({ category, skills }) => (
              <div key={category} className="card card-padding">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-4">
                  {category}
                  <span className="ml-2 text-xs text-gray-400 font-normal normal-case">({skills.length})</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm
                                 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                                 border border-gray-200 dark:border-gray-700"
                    >
                      {skill.name}
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        disabled={deleting === skill.id}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                        title="Delete"
                      >
                        {deleting === skill.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Trash2 className="w-3 h-3" />
                        }
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
