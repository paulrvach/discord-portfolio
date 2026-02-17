import { DeepAgentExperienceShowcase } from './deep-agent-experience'
import { KafkaDeploymentExperienceShowcase } from './kafka-deployment-experience'
import { StageDiveExperienceShowcase } from './stage-dive-experience'
import { SmoothScroll } from './smooth-scroll'

export function ProfileTabsPanel() {
  return (
    <SmoothScroll className="flex-1 min-h-0">
      <div className="bg-discord-dark rounded-xl shadow-xl">
        <div className="px-6 pb-6 space-y-6">
          <DeepAgentExperienceShowcase />
          <KafkaDeploymentExperienceShowcase />
          <StageDiveExperienceShowcase />
        </div>
      </div>
    </SmoothScroll>
  )
}
