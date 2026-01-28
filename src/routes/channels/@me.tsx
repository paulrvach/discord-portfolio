import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import {
  GraduationCap,
  MapPin,
  Github,
  Palette,
  Music,
  Code2,
} from 'lucide-react'
import { SidebarNavigation } from '../../components/discord/profile/sidebar-navigation'
import { ProfileHeader } from '../../components/discord/profile/profile-header'
import { InfoCard } from '../../components/discord/profile/info-card'
import { QuickActionsList } from '../../components/discord/profile/quick-actions-list'
import { ExperienceSection } from '../../components/discord/profile/experience-section'
import { ProfileBadge, Experience, QuickAction } from '../../components/discord/profile/types'

const BANNER_STORAGE_ID = 'kg20412jssev9jrjnphk7c75e98013hv'
const AVATAR_STORAGE_ID = 'kg22ekd3tpraawxc6q7gg1tyw58018ha'
const LOCATION_ICON_STORAGE_ID = 'kg26e9zs1sh087chnx13c5mmvx800jed'
const CS_MAJOR_ICON_STORAGE_ID = 'kg2aqt0jh7j75by34j63s7k1xn801fgs'
const GITHUB_ICON_STORAGE_ID = 'kg24xc30sp8njsr8kg9nd82eg9801tf9'

export const Route = createFileRoute('/channels/@me')({
  component: DMHome,
})

function DMHome() {
  const bannerUrl = useQuery(api.storage.getUrl, { storageId: BANNER_STORAGE_ID })
  const avatarUrl = useQuery(api.storage.getUrl, { storageId: AVATAR_STORAGE_ID })
  const locationIconUrl = useQuery(api.storage.getUrl, { storageId: LOCATION_ICON_STORAGE_ID })
  const csMajorIconUrl = useQuery(api.storage.getUrl, { storageId: CS_MAJOR_ICON_STORAGE_ID })
  const githubIconUrl = useQuery(api.storage.getUrl, { storageId: GITHUB_ICON_STORAGE_ID })

  const profileBadges: ProfileBadge[] = [
    {
      id: 'location',
      icon: MapPin,
      color: 'text-discord-blurple',
      bgColor: 'bg-discord-blurple/20',
      label: 'Location',
      value: 'Los Angeles, CA',
      imageUrl: locationIconUrl,
    },
    {
      id: 'education',
      icon: GraduationCap,
      color: 'text-discord-yellow',
      bgColor: 'bg-discord-yellow/20',
      label: 'Education',
      value: 'Irvine Valley College',
      sublabel: 'Computer Science',
      imageUrl: csMajorIconUrl,
    },
    {
      id: 'github',
      icon: Github,
      color: 'text-discord-text-primary',
      bgColor: 'bg-discord-hover',
      label: 'GitHub',
      value: '@paulvachon',
      href: 'https://github.com/paulvachon',
      imageUrl: githubIconUrl,
    },
    {
      id: 'code',
      icon: Code2,
      color: 'text-discord-green',
      bgColor: 'bg-discord-green/20',
      label: 'Status',
      value: 'Open to opportunities',
    },
  ]

  const sections = [
    { label: 'Experience', active: true },
    { label: 'Projects', active: false },
    { label: 'Education', active: false },
    { label: 'Contact', active: false },
  ]

  const experiences: Experience[] = [
    {
      title: 'Google',
      subtitle: 'AI Internship/Mentorship',
      date: 'October 2025 – December 2025',
      role: 'Software Engineer - React',
      image:
        'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=1600&auto=format&fit=crop',
      color: 'blue' as const,
      tech: ['LangChain', 'Gemini API', 'Docker', 'Google Cloud Run', 'Tavily API'],
      highlights: [
        'Architected a multi-agent autonomous system using LangChain\'s Deep Agent framework, orchestrating a hierarchy of specialized sub-agents to execute complex, multi-step health analysis tasks without human intervention.',
        'Orchestrated a context-aware virtual file system and Deep Search capabilities (via Tavily API), enabling agents to autonomously verify real-time data and persist state through advanced context engineering strategies.',
        'Deployed containerized architecture using Docker and Google Cloud Run, configuring the Gemini API for high-throughput inference and auto-scaling to handle variable request loads.',
        'Presented final architecture and product demo to community college boards and Google leadership, demonstrating the practical application of AI agents in ed-tech and health-tech sectors.',
      ],
    },
    {
      title: 'Los Angeles Trade-Technical College',
      subtitle: 'Software Engineering Volunteer',
      date: 'June 2025 – August 2025',
      role: 'Software Engineer',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop',
      color: 'green' as const,
      tech: ['OpenAI Assistant API', 'Vector Stores', 'AWS Lambda', 'PDF Processing'],
      highlights: [
        'Engineered intelligent document processing pipeline using OpenAI\'s Assistant API and vector stores, autonomously parsing unstructured PDF recipe catalogs into structured JSON schemas automating weekly inventory procurement process.',
        'Architected a serverless query agent on AWS Lambda, leveraging event-driven compute to handle real-time inventory inquiries (FIQ) and automate operational responses without provisioning dedicated infrastructure.',
      ],
    },
    {
      title: 'StageDive',
      subtitle: 'Audio Streaming Service',
      date: 'January 2024 – June 2024',
      role: 'Software Engineer - React',
      image:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
      color: 'purple' as const,
      tech: ['React Query', 'React Suspense', 'Shadcn/UI', 'TypeScript', 'Zod'],
      highlights: [
        'Implemented React Query with React Suspense API to add loading states and error feedback, enhancing responsiveness and reliability, and simplifying asynchronous data management.',
        'Customized Shadcn/UI TypeScript component library to ensure uniform design and component implementation, promoting a cohesive developer and user experience.',
        'Optimized state management strategies to enhance page hydration, significantly improving user experience and performance while reducing client-side errors.',
        'Reengineered user flow for account creation and music exploration, resulting in a more intuitive user journey and positive user feedback.',
        'Utilized TypeScript Zod library for robust type checking and real-time feedback on user inputs, enhancing data integrity and user interaction.',
      ],
    },
    {
      title: 'Open Source Labs',
      subtitle: 'Kafka Nimbus - GUI for deploying Kafka Clusters',
      date: 'March 2023 – December 2023',
      role: 'Software Engineer - Full Stack',
      image:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
      color: 'orange' as const,
      tech: ['Next.js', 'Kafka', 'Prometheus', 'Grafana', 'MongoDB', 'tRPC', 'AWS-SDK'],
      highlights: [
        'Leveraged Next.js App Router Framework with new React client and server components, effectively optimizing page loading and hydration, resulting in faster initial load times and minimizing client-side requests.',
        'Implemented file-based dynamic and static routing to orchestrate user flow in visually appealing and intuitive graphical interface.',
        'Established a dynamic connection between Kafka servers and Prometheus to scrape real-time metrics from the cloud through HTTP request and response cycles for enhanced monitoring capabilities.',
        'Implemented Grafana to develop informative dashboards, enabling the visualization of Kafka broker and topic metrics for enhanced data analysis and interactive graph-based monitoring.',
        'Integrated an ORM framework with MongoDB database for streamlined schema migrations and simplified development operations.',
        'Developed API routes using tRPC for seamless end-to-end type safety eliminating unnecessary runtime type errors.',
        'Utilized the AWS-SDK to programmatically deploy and manage remote MSK clusters facilitating fast and intuitive experience for developers.',
      ],
    },
  ]

  const quickActions: QuickAction[] = [
    {
      title: 'GitHub Contributions',
      description: 'Navigate your repository history.',
      href: 'https://github.com/paulvachon?tab=contributions',
      icon: Github,
    },
    {
      title: 'Art Showcase',
      description: 'Blender + Unreal Engine explorations.',
      href: 'https://www.artstation.com/',
      icon: Palette,
    },
    {
      title: 'Game/Song Recommendations',
      description: 'Steam favorites + electronic production.',
      href: 'https://open.spotify.com/',
      icon: Music,
    },
  ]

  return (
    <div className="flex-1 flex min-h-0">
      <SidebarNavigation sections={sections} />
      <main className="flex-1 flex flex-col bg-discord-chat min-h-0 overflow-y-auto">
        <ProfileHeader
          bannerUrl={bannerUrl}
          avatarUrl={avatarUrl}
          profileBadges={profileBadges}
        />
        <section className="px-6 pb-12">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <InfoCard />
              <QuickActionsList actions={quickActions} />
            </div>
            <ExperienceSection experiences={experiences} />
          </div>
        </section>
      </main>
    </div>
  )
}
