'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github, ExternalLink, Star, Calendar } from 'lucide-react'
import { ProjectCardSkeleton } from '@/components/ui/SkeletonCard'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types/database'

interface ProjectsSectionProps {
  projects: Project[]
  isLoading?: boolean
}

export function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Derive unique categories from data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)))
    return ['All', ...cats]
  }, [projects])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((p) => p.category === activeCategory)
  }, [projects, activeCategory])

  return (
    <section id="projects" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="section-container">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
            Portfolio
          </p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Real-world applications spanning mobile, machine learning, and AR systems.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <p>No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const dateStr = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short',
  })

  return (
    <article className="card flex flex-col overflow-hidden group hover:-translate-y-1 transition-all duration-200">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-200 dark:text-gray-600 select-none">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                             bg-amber-400 text-amber-900 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary">{project.category}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 card-padding">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3">
          <Calendar className="w-3 h-3" />
          {dateStr}
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-snug">
          {project.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs font-medium
                         bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400
                         hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
            </Link>
          )}
          <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 ml-auto" />
        </div>
      </div>
    </article>
  )
}
