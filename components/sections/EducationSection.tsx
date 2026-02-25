import { GraduationCap, BookOpen, Award } from 'lucide-react'

const coursework = [
  'Data Structures & Algorithms',
  'Object-Oriented Programming',
  'Software Engineering',
  'Machine Learning',
  'Database Systems',
  'Mobile Application Development',
  'Computer Networks',
  'Operating Systems',
  'Augmented & Virtual Reality',
  'Web Technologies',
]

export function EducationSection() {
  return (
    <section id="education" className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
            Education
          </p>
          <h2 className="section-title">Academic Background</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Degree card */}
          <div className="lg:col-span-1">
            <div className="card card-padding h-full">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30
                              flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                BS Computer Science
              </h3>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3">
                Final Year — 8th Semester
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Currently completing a four-year undergraduate degree with a focus on
                software engineering, AI, and mobile systems development.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400
                                 text-xs font-semibold border border-green-100 dark:border-green-800">
                  <Award className="w-3 h-3" />
                  Active Enrollment
                </span>
              </div>
            </div>
          </div>

          {/* Coursework */}
          <div className="lg:col-span-2">
            <div className="card card-padding h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30
                                flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Relevant Coursework
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coursework.map((course) => (
                  <div
                    key={course}
                    className="flex items-center gap-2.5 p-3 rounded-lg
                               bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {course}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
