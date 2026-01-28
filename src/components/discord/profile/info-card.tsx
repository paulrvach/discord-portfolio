import { MapPin, GraduationCap, Github, Code2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Separator } from '../../ui/separator'

export function InfoCard() {
  return (
    <Card className="bg-discord-dark border border-discord-divider">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-discord-text-muted">
          Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-discord-text-muted mb-2">
            About Me
          </h3>
          <p className="text-sm text-discord-text-primary leading-relaxed">
            Software Engineer specializing in Full Stack development and AI/ML.
            Building multi-agent systems and modern web applications.
          </p>
        </div>
        <Separator className="bg-discord-divider" />
        <div className="space-y-2 text-sm text-discord-text-secondary">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Los Angeles, CA</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Irvine Valley College • Computer Science</span>
          </div>
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <span>github.com/paulvachon</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>Open to opportunities</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
