import { HeroSection }      from '@/components/sections/HeroSection'
import { AboutSection }     from '@/components/sections/AboutSection'
import { SkillsSection }    from '@/components/sections/SkillsSection'
import { ProjectsSection }  from '@/components/sections/ProjectsSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { ContactSection }   from '@/components/sections/ContactSection'
import {
  getProfile,
  getPublishedProjects,
  getSkillsGrouped,
} from '@/lib/queries'

// Revalidate every 60 seconds (ISR — fast + always up-to-date)
export const revalidate = 60

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [profile, projects, skillCategories] = await Promise.all([
    getProfile(),
    getPublishedProjects(),
    getSkillsGrouped(),
  ])

  return (
    <>
      <HeroSection      profile={profile} />
      <AboutSection     profile={profile} />
      <SkillsSection    skillCategories={skillCategories} />
      <ProjectsSection  projects={projects} />
      <EducationSection />
      <ContactSection   contactEmail={profile?.email} />
    </>
  )
}
