'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, Loader2, FolderKanban,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types/database'

export default function AdminProjectsPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const togglePublished = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !project.is_published })
      .eq('id', project.id)

    if (error) { toast.error('Update failed.'); return }
    toast.success(project.is_published ? 'Project unpublished.' : 'Project published.')
    fetchProjects()
  }

  const toggleFeatured = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ featured: !project.featured })
      .eq('id', project.id)

    if (error) { toast.error('Update failed.'); return }
    toast.success(project.featured ? 'Removed from featured.' : 'Marked as featured.')
    fetchProjects()
  }

  const deleteProject = async (id: string) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setDeleting(id)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) { toast.error('Delete failed.'); setDeleting(null); return }
    toast.success('Project deleted.')
    setDeleting(null)
    fetchProjects()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projects.length} total</p>
          </div>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card card-padding text-center py-16 text-gray-400 dark:text-gray-600">
          <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No projects yet. Add your first one.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                        {project.description.slice(0, 60)}…
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <Badge variant="primary">{project.category}</Badge>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Badge variant={project.is_published ? 'green' : 'gray'}>
                        {project.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {project.featured && <Badge variant="yellow">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Toggle published */}
                      <button
                        onClick={() => togglePublished(project)}
                        title={project.is_published ? 'Unpublish' : 'Publish'}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        {project.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      {/* Toggle featured */}
                      <button
                        onClick={() => toggleFeatured(project)}
                        title={project.featured ? 'Remove featured' : 'Mark featured'}
                        className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${project.featured ? 'text-amber-500' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      >
                        <Star className="w-4 h-4" fill={project.featured ? 'currentColor' : 'none'} />
                      </button>
                      {/* Edit */}
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {/* Delete */}
                      <button
                        onClick={() => deleteProject(project.id)}
                        disabled={deleting === project.id}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        {deleting === project.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
