import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import {
  Briefcase,
  FolderOpen,
  GraduationCap,
  Mail,
  Hash,
  MapPin,
  Phone,
  Calendar,
  Building2,
  Github,
  Palette,
  Music,
  ArrowUpRight,
  Code2,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { GlowCard } from '../../components/spotlight-card'
import { cn } from '../../lib/utils'

const BANNER_STORAGE_ID = 'kg20412jssev9jrjnphk7c75e98013hv'
const AVATAR_STORAGE_ID = 'kg22ekd3tpraawxc6q7gg1tyw58018ha' // Replace with actual avatar storage ID if different
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
  console.log("bannerUrl", bannerUrl)
  console.log("avatarUrl", avatarUrl)
  const profileBadges = [
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

  const experiences = [
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

  const quickActions = [
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
      <aside className="w-64 bg-discord-dark flex flex-col border-r border-discord-divider">
        <div className="px-3 py-4">
          <div className="text-xs uppercase tracking-wide text-discord-text-muted">
            Portfolio
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {sections.map((section) => (
              <div
                key={section.label}
                className={cn('channel-item', section.active && 'active')}
              >
                <Hash className="w-4 h-4 text-discord-channel-icon" />
                <span className="text-sm">#{section.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto px-4 py-4 text-xs text-discord-text-muted">
          Last updated Jan 2026
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-discord-chat min-h-0 overflow-y-auto">
        <section className="relative">
          {/* Banner */}
          <div className="h-36 md:h-48 w-full overflow-hidden">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt="Profile banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(88,101,242,0.3),rgba(0,0,0,0.95))] bg-center" />
            )}
          </div>

          {/* Profile Card */}
          <div className="px-4 md:px-6  pb-6">
            <div className="bg-discord-dark rounded-lg p-4 border border-discord-divider">
              {/* Avatar Row */}
              <div className="flex items-end gap-4 -mt-14 mb-4">
                {/* Avatar with Status */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <Avatar className="size-20 md:size-24 border-[6px] border-discord-dark ring-0 ">
                        <AvatarImage src={"https://helpful-kingfisher-649.convex.cloud/api/storage/64ca8229-56a5-49da-9e05-41c63570f4b1"} alt="Paul Vachon" className="object-cover" />
                        <AvatarFallback className="bg-discord-blurple text-2xl font-bold text-white">
                          PV
                        </AvatarFallback>
                      </Avatar>
                      {/* Status Indicator */}
                      <div className="absolute bottom-1 right-1 size-5 md:size-6 rounded-full bg-discord-dark flex items-center justify-center">
                        <div className="size-3 md:size-4 rounded-full bg-discord-green" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-discord-darker border-none px-3 py-2 flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Sparkles className="w-4 h-4 text-discord-yellow" />
                    </motion.div>
                    <span className="font-medium">Cooking up something new...</span>
                  </TooltipContent>
                </Tooltip>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pb-2">
                  {profileBadges.map((badge) => {
                    const Icon = badge.icon
                    const content = (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'size-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors',
                        )}
                      >
                        {badge.imageUrl ? (
                          <img 
                            src={badge.imageUrl} 
                            alt={badge.label}
                            className="w-8 h-8 object-fill rounded mix-blend-plus-lighter"
                          />
                        ) : (
                          <Icon className={cn('w-5 h-5', badge.color)} />
                        )}
                      </motion.div>
                    )

                    return (
                      <Tooltip key={badge.id}>
                        <TooltipTrigger asChild>
                          {badge.href ? (
                            <a href={badge.href} target="_blank" rel="noreferrer">
                              {content}
                            </a>
                          ) : (
                            <div>{content}</div>
                          )}
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-discord-darker border-none p-3 min-w-[140px]"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-discord-text-muted uppercase tracking-wider">
                              {badge.label}
                            </span>
                            <span className="font-semibold text-discord-text-primary">
                              {badge.value}
                            </span>
                            {badge.sublabel && (
                              <span className="text-xs text-discord-text-secondary">
                                {badge.sublabel}
                              </span>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>

              {/* Name & Info */}
              <div className="space-y-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-discord-text-primary">
                    Paul Vachon
                  </h1>
                  <p className="text-sm text-discord-text-secondary">paulvachon</p>
                </div>

                <Separator className="bg-discord-divider" />

                <div className="pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-discord-text-muted mb-2">
                    About Me
                  </h3>
                  <p className="text-sm text-discord-text-primary leading-relaxed">
                    Software Engineer specializing in Full Stack development and AI/ML.
                    Building multi-agent systems and modern web applications.
                  </p>
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-discord-text-muted mb-2">
                    Contact
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-discord-text-secondary">
                    <Phone className="w-4 h-4" />
                    <span>(626) 733-7708</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-8">
          <div className="flex items-center gap-2 mb-4 text-discord-text-primary">
            <Briefcase className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Experience</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {experiences.map((experience) => (
              <Dialog key={experience.title}>
                <DialogTrigger asChild>
                  <button className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-discord-blurple rounded-2xl group cursor-pointer">
                    <GlowCard customSize className="w-full h-auto overflow-hidden" glowColor={experience.color}>
                      <div className="relative z-10 flex flex-col">
                        <div
                          className="h-20 -mx-4 -mt-4 bg-cover bg-center mb-3 transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${experience.image})` }}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-discord-text-muted font-mono uppercase tracking-wider">
                            {experience.date}
                          </span>
                          <h3 className="text-sm font-bold text-discord-text-primary leading-tight group-hover:text-discord-blurple transition-colors">
                            {experience.title}
                          </h3>
                          <p className="text-xs text-discord-text-secondary line-clamp-2">
                            {experience.subtitle}
                          </p>
                        </div>
                      </div>
                    </GlowCard>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-card border-border shadow-2xl" showCloseButton={false}>
                  {/* Notion-style Cover */}
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={experience.image}
                      alt={`${experience.title} cover`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <Card className="border-0 shadow-none rounded-none bg-card py-0">
                    <CardHeader className="px-8 md:px-12 pt-6 pb-4">
                      <CardTitle className="text-2xl md:text-3xl text-card-foreground">
                        {experience.title}
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground">
                        {experience.subtitle}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 md:px-12 pb-8 overflow-y-auto max-h-[calc(90vh-18rem)]">
                      {/* Properties */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground w-24">
                            <Calendar className="w-4 h-4" />
                            <span>Date</span>
                          </div>
                          <span className="text-card-foreground">{experience.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground w-24">
                            <Building2 className="w-4 h-4" />
                            <span>Role</span>
                          </div>
                          <span className="text-card-foreground">{experience.role}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground w-24 shrink-0">
                            <Hash className="w-4 h-4" />
                            <span>Stack</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {experience.tech.map((t) => (
                              <Badge key={t} variant="secondary" className="text-xs">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Highlights */}
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                          Highlights
                        </h3>
                        <ul className="space-y-3">
                          {experience.highlights.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-card-foreground leading-relaxed">
                              <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="flex items-center gap-2 mb-4 text-discord-text-primary">
            <FolderOpen className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.a
                  key={action.title}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4 }}
                  className="rounded-xl bg-discord-blurple text-primary-foreground p-4 flex flex-col gap-2 shadow-lg transition-colors hover:bg-discord-blurple/90"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5" />
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </div>
                  <span className="text-sm font-semibold">{action.title}</span>
                  <span className="text-xs opacity-80">{action.description}</span>
                </motion.a>
              )
            })}
          </div>

          <Separator className="my-8 bg-discord-divider" />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-discord-text-muted text-xs">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Irvine Valley College • Computer Science</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>(626) 733-7708</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Los Angeles, CA</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
