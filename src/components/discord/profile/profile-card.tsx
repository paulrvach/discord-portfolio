import type { CSSProperties } from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { CalendarDays, MoreHorizontal, UserPlus, MessageCircle, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import { cn } from '@/lib/utils'
import { ProfileHeader } from './profile-header'
import type { ProfileBadge } from './types'

export type ProfileConnection = {
  id: string
  label: string
  href?: string
  iconUrl?: string | null
}

export type ProfileRole = {
  id: string
  label: string
  color: string
  avatarUrl: string
  animation: 'pop' | 'bounce' | 'float' | 'jitter' | 'spin' | 'glow'
}

interface ProfileCardProps {
  bannerUrl?: string | null
  avatarUrl?: string | null
  profileBadges: ProfileBadge[]
  name: string
  username: string
  statusText: string
  location: string
  bio: string
  memberSince: string
  roles: ProfileRole[]
  connections: ProfileConnection[]
}

export function ProfileCard({
  bannerUrl,
  avatarUrl,
  profileBadges,
  name,
  username,
  statusText,
  location,
  bio,
  memberSince,
  roles,
  connections,
}: ProfileCardProps) {
  // Helper function to shift hue of a hex color
  const shiftHue = (hex: string, degrees: number): string => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    // Convert RGB to HSL
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    // Shift hue
    h = (h * 360 + degrees) % 360
    if (h < 0) h += 360

    // Convert back to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r2 = 0,
      g2 = 0,
      b2 = 0
    if (h < 60) {
      r2 = c
      g2 = x
      b2 = 0
    } else if (h < 120) {
      r2 = x
      g2 = c
      b2 = 0
    } else if (h < 180) {
      r2 = 0
      g2 = c
      b2 = x
    } else if (h < 240) {
      r2 = 0
      g2 = x
      b2 = c
    } else if (h < 300) {
      r2 = x
      g2 = 0
      b2 = c
    } else {
      r2 = c
      g2 = 0
      b2 = x
    }

    const rFinal = Math.round((r2 + m) * 255)
    const gFinal = Math.round((g2 + m) * 255)
    const bFinal = Math.round((b2 + m) * 255)

    return `#${rFinal.toString(16).padStart(2, '0')}${gFinal.toString(16).padStart(2, '0')}${bFinal.toString(16).padStart(2, '0')}`
  }

  const getRoleHoverMotion = (role: ProfileRole): MotionProps => {
    const glowColor = `${role.color}55`
    const easeInOut = [0.4, 0, 0.2, 1] as const

    switch (role.animation) {
      case 'pop':
        return {
          whileHover: {
            scale: [1, 1.08, 1],
            rotate: [0, -2, 2, 0],
            filter: ['saturate(1)', 'saturate(1.35)', 'saturate(1)'],
          },
          transition: { duration: 1, ease: easeInOut, repeat: Infinity },
        }
      case 'bounce':
        return {
          whileHover: {
            y: [0, -4, 0],
            scale: [1, 1.03, 1],
            filter: ['hue-rotate(0deg)', 'hue-rotate(12deg)', 'hue-rotate(0deg)'],
          },
          transition: { duration: 0.9, ease: easeInOut, repeat: Infinity },
        }
      case 'float':
        return {
          whileHover: {
            y: [0, 4, 0],
            rotate: [0, 1.5, -1.5, 0],
            filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
          },
          transition: { duration: 1.4, ease: easeInOut, repeat: Infinity },
        }
      case 'jitter':
        return {
          whileHover: {
            x: [0, 2, -2, 1, 0],
            y: [0, -1, 1, 0],
            rotate: [0, 2, -2, 0],
            filter: ['contrast(1)', 'contrast(1.2)', 'contrast(1)'],
          },
          transition: { duration: 0.7, ease: easeInOut, repeat: Infinity },
        }
      case 'spin':
        return {
          whileHover: {
            scale: [1, 1.1, 0.95, 1.1, 1],
            rotate: [0, 5, -5, 3, 0],
            filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)', 'brightness(1.2)', 'brightness(1)'],
          },
          transition: { duration: 1.2, ease: easeInOut, repeat: Infinity },
        }
      case 'glow':
        return {
          whileHover: {
            boxShadow: [
              `0 0 0 0 ${glowColor}`,
              `0 0 12px 3px ${glowColor}`,
              `0 0 0 0 ${glowColor}`,
            ],
            filter: ['saturate(1)', 'saturate(1.5)', 'saturate(1)'],
          },
          transition: { duration: 1.3, ease: easeInOut, repeat: Infinity },
        }
      default:
        return {}
    }
  }

  return (
    <section className="bg-discord-dark rounded-xl border border-discord-divider overflow-hidden shadow-xl">
      <ProfileHeader
        bannerUrl={bannerUrl}
        avatarUrl={avatarUrl}
        profileBadges={profileBadges}
        name={name}
        username={username}
        variant="card"
        showIdentity={false}
      />

      <div className="px-4 pb-4 space-y-4">
        <div className=" items-center justify-between">
          <div>
            <h2
              className="text-xl md:text-3xl font-bold pixel-text tracking-widest relative inline-block"
              style={{
                color: '#00ff88',
                textShadow: '0 0 4px rgba(0, 255, 136, 0.4), 0 0 8px rgba(0, 255, 136, 0.25)',
                paddingBottom: '0.1em',
              }}
            >
              {name}
            </h2>
            <p className="text-sm text-discord-text-muted">@{username}</p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button className="bg-discord-blurple hover:bg-discord-blurple/90 text-white h-8 px-3 text-xs">
              <UserPlus className="w-4 h-4" />
              Add Friend
            </Button>
            <Button
              variant="secondary"
              className="bg-discord-hover text-discord-text-primary h-8 px-3 text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-discord-hover text-discord-text-primary hover:bg-discord-hover/80"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-discord-text-secondary">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <div className="rounded-lg bg-discord-darker border border-discord-divider p-3 text-sm text-discord-text-primary">
          {bio}
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-discord-text-muted mb-2">
            Status
          </div>
          <div className="text-sm text-discord-text-primary">{statusText}</div>
        </div>

        <Separator className="bg-discord-divider" />

        <div>
          <div className="text-xs uppercase tracking-wide text-discord-text-muted mb-2">
            Member Since
          </div>
          <div className="flex items-center gap-2 text-sm text-discord-text-secondary">
            <CalendarDays className="w-4 h-4" />
            <span>{memberSince}</span>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-discord-text-muted mb-2">
            Roles
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge
                key={role.id}
                variant="outline"
                asChild
                className={cn(
                  'gap-2 rounded-full border px-2 py-1 text-xs font-medium cursor-pointer',
                  'transition-[transform,box-shadow,background-image,color,border-color]'
                )}
                style={
                  {
                    color: role.color,
                    borderColor: `color-mix(in oklch, ${role.color} 85%, transparent)`,
                    backgroundImage: `linear-gradient(120deg, color-mix(in oklch, ${shiftHue(role.color, 30)} 35%, transparent), color-mix(in oklch, ${shiftHue(role.color, -30)} 15%, transparent))`,
                  } as CSSProperties
                }
              >
                <motion.span {...getRoleHoverMotion(role)} className="inline-flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${role.color}, ${shiftHue(role.color, 60)})`,
                    }}
                  />
                  {role.label}
                </motion.span>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-discord-text-muted mb-2">
            Connections
          </div>
          <div className="space-y-2">
            {connections.map((connection) => (
              <a
                key={connection.id}
                href={connection.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-md bg-discord-darker border border-discord-divider px-3 py-2 text-sm text-discord-text-primary hover:bg-discord-hover transition-colors"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={connection.iconUrl ?? undefined} />
                  <AvatarFallback className="bg-discord-channel text-xs">
                    {connection.label.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{connection.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
