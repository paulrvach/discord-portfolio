import { Calendar, Building2, Hash } from 'lucide-react'
import { Badge } from '../../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Dialog, DialogContent, DialogTrigger } from '../../ui/dialog'
import { Separator } from '../../ui/separator'
import { GlowCard } from '../../spotlight-card'
import { Experience } from './types'

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Dialog>
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
        <div className="h-44 w-full overflow-hidden relative">
          <img
            src={experience.image}
            alt={`${experience.title} cover`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        </div>

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
  )
}
