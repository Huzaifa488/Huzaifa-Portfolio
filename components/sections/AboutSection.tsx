import { GraduationCap, Target, Cpu } from 'lucide-react'
import type { Profile } from '@/types/database'

interface AboutSectionProps {
  profile: Profile | null
}

const highlights = [
  {
    icon: GraduationCap,
    title: 'Academic Background',
    description:
      'BS Computer Science, 8th Semester (Final Year). Studying advanced topics in software engineering, algorithms, machine learning, and mobile application development.',
  },
  {
    icon: Cpu,
    title: 'Technical Focus',
    description:
      'Specialising in Android development with Java, machine learning pipelines with Python and Scikit-learn, and full-stack web systems with modern frameworks.',
  },
  {
    icon: Target,
    title: 'Career Direction',
    description:
      'Targeting software development roles and graduate programs in computer science, with a focus on building impactful AI and mobile systems at scale.',
  },
]

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="section-padding bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="section-container">
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
            About Me
          </p>
          <h2 className="section-title">
            Building software that{' '}
            <span className="text-primary-600 dark:text-primary-400">matters.</span>
          </h2>
          <p className="section-subtitle mt-4">
            {profile?.bio ??
              'A passionate software developer combining academic rigour with real-world project experience to build systems that solve genuine problems.'}
          </p>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card card-padding group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30
                              flex items-center justify-center mb-4
                              group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50
                              transition-colors">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '3+',    label: 'Projects Delivered' },
            { value: '4+',    label: 'Years of Coding'    },
            { value: '5+',    label: 'Technologies'       },
            { value: '8th',   label: 'Semester (CS)'      },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
