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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { AgentCommitShowcase } from './agent-commit-showcase'

const albumCards = [
  {
    id: 'components',
    title: 'Component Library',
    subtitle: 'Shadcn UI system',
    icon: Library,
    storageId: 'kg21tnxck2gkxxhetx0y94tf9n80kqsq',
  },
  {
    id: 'streaming',
    title: 'Streaming Experience',
    subtitle: 'Realtime playback',
    icon: Radio,
    storageId: 'kg24h77s8zqv3yykzznxswnb6980j82k',
  },
  {
    id: 'design',
    title: 'Design Tokens',
    subtitle: 'Theme + accessibility',
    icon: Sparkles,
    storageId: 'kg25p48txxfeb6qtbx4z23n07580kh9y',
  },
  {
    id: 'audio',
    title: 'Audio UX',
    subtitle: 'Playlist interactions',
    icon: Headphones,
    storageId: 'kg2eshgawqaj50zajgm2etwacd80jea0',
  },
]

export function StageDiveExperienceShowcase({ className }: { className?: string }) {
  const mainImageUrl = useQuery(api.storage.getUrl, {
    storageId: 'kg22fn446bqckb8zjz5130wf9h80kzbt',
  })

  const componentImageUrl = useQuery(api.storage.getUrl, {
    storageId: 'kg21tnxck2gkxxhetx0y94tf9n80kqsq',
  })

  const streamingImageUrl = useQuery(api.storage.getUrl, {
    storageId: 'kg24h77s8zqv3yykzznxswnb6980j82k',
  })

  const designImageUrl = useQuery(api.storage.getUrl, {
    storageId: 'kg25p48txxfeb6qtbx4z23n07580kh9y',
  })

  const audioImageUrl = useQuery(api.storage.getUrl, {
    storageId: 'kg2eshgawqaj50zajgm2etwacd80jea0',
  })

  const albumImageUrls: Record<string, string | undefined> = {
    components: componentImageUrl || undefined,
    streaming: streamingImageUrl || undefined,
    design: designImageUrl || undefined,
    audio: audioImageUrl || undefined,
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-2xl border-discord-divider bg-discord-dark p-4 lg:p-6 space-y-6',
        className
      )}
    >
      <div className="pointer-events-none absolute -top-10 -left-20 h-64 w-64 rounded-full bg-discord-blurple/20 blur-[60px]" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-discord-divider bg-discord-darker">
              <Menu className="h-5 w-5 text-discord-text-primary" />
            </Button>
            <div className="flex items-center gap-2 text-discord-text-primary">
              <Avatar className="h-9 w-9 bg-discord-hover">
                <AvatarFallback className="bg-discord-hover">
                  <AudioLines className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-lg font-semibold">StageDive</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-discord-text-muted" />
              <Input
                placeholder="Search songs, albums, artists"
                className="pl-9 border-discord-divider bg-discord-hover text-sm text-discord-text-muted"
              />
            </div>
            <Avatar className="h-10 w-10 border border-discord-divider bg-discord-darker">
              <AvatarFallback className="bg-discord-darker">
                <UserCircle2 className="h-5 w-5 text-discord-text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Separator className="bg-discord-divider" />

        <Card className="rounded-2xl border-none bg-transparent p-4 lg:p-6">
          <CardContent className="flex flex-col lg:flex-row gap-6 p-0">
            <div className="relative h-40 w-full max-w-[220px] rounded-xl bg-discord-hover overflow-hidden">
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt="Stage Dive"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-discord-blurple/30 via-discord-dark to-discord-darker" />
              )}
              <div className="absolute inset-0 bg-linear-to-br from-discord-blurple/20 via-transparent to-discord-darker/80" />
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-3 left-3 h-auto rounded-full bg-discord-blurple/20 border-discord-blurple/40 p-2 z-10"
              >
                <Play className="h-4 w-4 text-discord-text-primary" />
              </Button>
              <div className="absolute top-3 left-3 text-[11px] uppercase tracking-[0.2em] text-discord-text-muted z-10">
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
                <Badge
                  variant="outline"
                  className="border-discord-blurple/40 bg-discord-blurple/15 text-xs text-discord-text-primary"
                >
                  <AudioLines className="h-3.5 w-3.5 text-discord-blurple" />
                  Built with shadcn/ui
                </Badge>
              </div>
              <p className="text-sm text-discord-text-secondary leading-relaxed max-w-2xl">
                I designed and shipped Stage Dive&apos;s component library to unify the UI system,
                speed up feature delivery, and ensure consistent patterns across the streaming
                experience.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-discord-text-muted">
                <Badge
                  variant="outline"
                  className="border-discord-divider bg-discord-dark"
                >
                  <ListMusic className="h-3.5 w-3.5 text-discord-text-secondary" />
                  UI kit foundations
                </Badge>
                <Badge
                  variant="outline"
                  className="border-discord-divider bg-discord-dark"
                >
                  <Heart className="h-3.5 w-3.5 text-discord-red" />
                  Streaming UX polish
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-discord-text-primary">Albums for you</h4>
          <div className="flex items-center gap-2 text-xs text-discord-text-muted">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-discord-divider bg-discord-darker text-discord-text-primary"
            >
              Play all
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-discord-divider bg-discord-darker"
            >
              <ChevronLeft className="h-4 w-4 text-discord-text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-discord-divider bg-discord-darker"
            >
              <ChevronRight className="h-4 w-4 text-discord-text-primary" />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {albumCards.map((card) => {
            const Icon = card.icon
            const imageUrl = albumImageUrls[card.id]
            return (
              <Card
                key={card.id}
                className="rounded-xl border-none bg-discord-darker p-4 space-y-3 transition-colors hover:bg-discord-hover"
              >
                <CardContent className="relative aspect-square rounded-lg bg-discord-hover overflow-hidden p-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-discord-blurple/20 via-discord-dark to-discord-darker" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-br from-discord-blurple/10 via-transparent to-discord-darker/60" />
                  <div className="absolute bottom-3 left-3 h-9 w-9 rounded-lg bg-discord-dark/80 border border-discord-divider flex items-center justify-center z-10">
                    <Icon className="h-4 w-4 text-discord-text-primary" />
                  </div>
                </CardContent>
                <CardHeader className="p-0">
                  <CardTitle className="text-sm font-semibold text-discord-text-primary">
                    {card.title}
                  </CardTitle>
                  <p className="text-xs text-discord-text-muted">
                    {card.subtitle} • Stage Dive
                  </p>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>


    </Card>
  )
}
