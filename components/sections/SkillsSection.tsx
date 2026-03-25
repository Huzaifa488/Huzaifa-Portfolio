import { SkillCategorySkeleton } from '@/components/ui/SkeletonCard'
import type { SkillCategory } from '@/types/database'

interface SkillsSectionProps {
  skillCategories: SkillCategory[]
  isLoading?: boolean
}

const categoryStyles: Record<string, { card: string; tag: string }> = {
  'Programming Languages': {
    card: 'hover:border-violet-200 dark:hover:border-violet-800',
    tag:  'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-800',
  },
  'Mobile Development': {
    card: 'hover:border-blue-200 dark:hover:border-blue-800',
    tag:  'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800',
  },
  'Machine Learning': {
    card: 'hover:border-emerald-200 dark:hover:border-emerald-800',
    tag:  'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800',
  },
  'Web & Full-Stack': {
    card: 'hover:border-primary-200 dark:hover:border-primary-800',
    tag:  'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-primary-100 dark:border-primary-800',
  },
  'Tools & DevOps': {
    card: 'hover:border-amber-200 dark:hover:border-amber-800',
    tag:  'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800',
  },
}

const defaultStyles = {
  card: 'hover:border-gray-300 dark:hover:border-gray-600',
  tag:  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
}

function getStyles(category: string) {
  return categoryStyles[category] ?? defaultStyles
}

export function SkillsSection({ skillCategories, isLoading }: SkillsSectionProps) {
  return (
    <section id="skills" className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">

        {/* Header */}
        <div className="mb-14 reveal">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400
                        uppercase tracking-widest mb-3">
            Technical Skills
          </p>
          <h2 className="section-title">My Tech Stack</h2>
          <p className="section-subtitle">
            Technologies and tools I use to build reliable, scalable software.
          </p>
        </div>

        {/* Skill grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkillCategorySkeleton key={i} />
            ))}
          </div>
        ) : skillCategories.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-600 py-16">
            No skills found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map(({ category, skills }, i) => {
              const { card: cardCls, tag: tagCls } = getStyles(category)
              return (
                <div
                  key={category}
                  className={`reveal stagger-${Math.min(i + 1, 6)}
                              card card-padding group
                              hover:-translate-y-1 transition-all duration-300
                              ${cardCls}`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4
                                 text-xs uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium border
                                    ${tagCls}
                                    hover:scale-105 transition-transform duration-150
                                    cursor-default`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
