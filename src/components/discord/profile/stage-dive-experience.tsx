import {
  AudioLines,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Headphones,
  Library,
  ListMusic,
  Menu,
  Play,
  Radio,
  Search,
  Sparkles,
  UserCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const albumCards = [
  {
    id: 'components',
    title: 'Component Library',
    subtitle: 'Shadcn UI system',
    icon: Library,
  },
  {
    id: 'streaming',
    title: 'Streaming Experience',
    subtitle: 'Realtime playback',
    icon: Radio,
  },
  {
    id: 'design',
    title: 'Design Tokens',
    subtitle: 'Theme + accessibility',
    icon: Sparkles,
  },
  {
    id: 'audio',
    title: 'Audio UX',
    subtitle: 'Playlist interactions',
    icon: Headphones,
  },
]

const quickPicks = [
  {
    id: 'nav',
    title: 'Reusable navigation shell',
    detail: 'Sidebars, command palette, app chrome',
  },
  {
    id: 'cards',
    title: 'Media cards + grids',
    detail: 'Album tiles, hero cards, hover motion',
  },
  {
    id: 'states',
    title: 'System states',
    detail: 'Loading, empty, and error patterns',
  },
  {
    id: 'docs',
    title: 'Documentation & handoff',
    detail: 'Storybook-ready usage notes',
  },
]

export function StageDiveExperienceShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-discord-divider bg-discord-dark p-4 lg:p-6 space-y-6',
        className
      )}
    >
      <div className="pointer-events-none absolute -top-10 -left-20 h-64 w-64 rounded-full bg-discord-blurple/20 blur-[60px]" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-discord-divider pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border border-discord-divider bg-discord-darker flex items-center justify-center">
              <Menu className="h-5 w-5 text-discord-text-primary" />
            </div>
            <div className="flex items-center gap-2 text-discord-text-primary">
              <div className="h-9 w-9 rounded-full bg-discord-hover flex items-center justify-center">
                <AudioLines className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold">StageDive</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-discord-divider bg-discord-hover px-3 py-2 text-sm text-discord-text-muted min-w-[220px]">
              <Search className="h-4 w-4" />
              Search songs, albums, artists
            </div>
            <div className="h-10 w-10 rounded-full border border-discord-divider bg-discord-darker flex items-center justify-center">
              <UserCircle2 className="h-5 w-5 text-discord-text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-discord-divider bg-discord-darker p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative h-40 w-full max-w-[220px] rounded-xl bg-discord-hover overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-discord-blurple/30 via-discord-dark to-discord-darker" />
              <div className="absolute bottom-3 left-3 rounded-full bg-discord-blurple/20 border border-discord-blurple/40 p-2">
                <Play className="h-4 w-4 text-discord-text-primary" />
              </div>
              <div className="absolute top-3 left-3 text-[11px] uppercase tracking-[0.2em] text-discord-text-muted">
                Stage Dive
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-discord-text-muted">
                Stage Dive Internship
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold text-discord-text-primary">
                  Audio Streaming Service
                </h3>
                <span className="inline-flex items-center gap-2 rounded-full border border-discord-blurple/40 bg-discord-blurple/15 px-3 py-1 text-xs text-discord-text-primary">
                  <AudioLines className="h-3.5 w-3.5 text-discord-blurple" />
                  Built with shadcn/ui
                </span>
              </div>
              <p className="text-sm text-discord-text-secondary leading-relaxed max-w-2xl">
                I designed and shipped Stage Dive&apos;s component library to unify the UI system,
                speed up feature delivery, and ensure consistent patterns across the streaming
                experience.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-discord-text-muted">
                <span className="inline-flex items-center gap-2 rounded-full border border-discord-divider bg-discord-dark px-3 py-1">
                  <ListMusic className="h-3.5 w-3.5 text-discord-text-secondary" />
                  UI kit foundations
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-discord-divider bg-discord-dark px-3 py-1">
                  <Heart className="h-3.5 w-3.5 text-discord-red" />
                  Streaming UX polish
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-discord-text-primary">Albums for you</h4>
          <div className="flex items-center gap-2 text-xs text-discord-text-muted">
            <button className="rounded-full border border-discord-divider bg-discord-darker px-3 py-1 text-discord-text-primary">
              Play all
            </button>
            <button className="h-9 w-9 rounded-full border border-discord-divider bg-discord-darker flex items-center justify-center">
              <ChevronLeft className="h-4 w-4 text-discord-text-primary" />
            </button>
            <button className="h-9 w-9 rounded-full border border-discord-divider bg-discord-darker flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-discord-text-primary" />
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {albumCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.id}
                className="rounded-xl border border-discord-divider bg-discord-darker p-4 space-y-3 transition-colors hover:bg-discord-hover"
              >
                <div className="relative aspect-square rounded-lg bg-discord-hover overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-discord-blurple/20 via-discord-dark to-discord-darker" />
                  <div className="absolute bottom-3 left-3 h-9 w-9 rounded-lg bg-discord-dark/80 border border-discord-divider flex items-center justify-center">
                    <Icon className="h-4 w-4 text-discord-text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-discord-text-primary">
                    {card.title}
                  </div>
                  <div className="text-xs text-discord-text-muted">
                    {card.subtitle} • Stage Dive
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-discord-text-primary">Quick picks</h4>
          <span className="text-xs text-discord-text-muted">Highlights delivered</span>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {quickPicks.map((pick) => (
            <div
              key={pick.id}
              className="flex items-start gap-3 rounded-xl border border-discord-divider bg-discord-darker px-4 py-3"
            >
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-discord-green" />
              <div>
                <div className="text-sm font-semibold text-discord-text-primary">
                  {pick.title}
                </div>
                <div className="text-xs text-discord-text-muted">{pick.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-discord-divider bg-discord-darker px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-discord-hover" />
            <div>
              <div className="text-sm font-semibold text-discord-text-primary">
                Stage Dive UI Library
              </div>
              <div className="text-xs text-discord-text-muted">
                Now building: streaming surfaces
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-discord-text-muted">
            <Clock3 className="h-4 w-4" />
            02:14 / 04:32
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-discord-hover overflow-hidden">
          <div className="h-full w-[55%] bg-discord-blurple" />
        </div>
      </div>
    </div>
  )
}
