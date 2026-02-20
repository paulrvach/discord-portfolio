import { DeepAgentExperienceShowcase } from './deep-agent-experience'
import { KafkaDeploymentExperienceShowcase } from './kafka-deployment-experience'
import { StageDiveExperienceShowcase } from './stage-dive-experience'
import { TradesTechExperienceShowcase } from './trade-tech-experience'
import { SmoothScroll } from './smooth-scroll'

export function ProfileTabsPanel() {
  return (
    <SmoothScroll className="flex-1 min-h-0">
      <div className="bg-discord-dark rounded-xl shadow-xl">
        <div className="px-6 pb-8  space-y-34">
          <section className="space-y-4">
            <header className=" pb-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-discord-text-muted">
                Work Experience
              </p>
              <h2 className="text-xl font-semibold text-discord-text-primary">
                Google - AI Internship/Mentorship
              </h2>
              <p className="text-sm text-discord-text-secondary">
                Software Engineer - React • October 2025 - December 2025
              </p>
            </header>
            <DeepAgentExperienceShowcase />
          </section>

          <section className="space-y-4">
            <header className=" pb-3">
              <h2 className="text-xl font-semibold text-discord-text-primary">
                Los Angeles Trade-Technical College
              </h2>
              <p className="text-sm text-discord-text-secondary">
                Software Engineering Volunteer • June 2025 - August 2025
              </p>
            </header>
            <TradesTechExperienceShowcase />
          </section>

          <section className="space-y-4">
            <header className=" pb-3">
              <h2 className="text-xl font-semibold text-discord-text-primary">
                StageDive - Audio Streaming Service
              </h2>
              <p className="text-sm text-discord-text-secondary">
                Software Engineer - React • January 2024 - June 2024
              </p>
            </header>
            <StageDiveExperienceShowcase />
          </section>

          <section className="space-y-4 mb-34">
            <header className=" pb-3">
              <h2 className="text-xl font-semibold text-discord-text-primary">
                Open Source Labs (Kafka Nimbus)
              </h2>
              <p className="text-sm text-discord-text-secondary">
                Software Engineer - Full Stack • March 2023 - December 2023
              </p>
            </header>
            <KafkaDeploymentExperienceShowcase />
          </section>
        </div>
      </div>
    </SmoothScroll>
  )
}
