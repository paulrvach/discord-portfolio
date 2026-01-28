import { Briefcase } from 'lucide-react'
import { Experience } from './types'
import { ExperienceCard } from './experience-card'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-discord-text-primary">
        <Briefcase className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Experience</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.title} experience={experience} />
        ))}
      </div>
    </div>
  )
}
