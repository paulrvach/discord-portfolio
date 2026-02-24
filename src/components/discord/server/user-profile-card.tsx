import type { CSSProperties, ComponentType } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, MapPin, MessageCircle, MoreHorizontal, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"

type UserProfileLink = {
  label: string
  url: string
}

type UserProfileRole = {
  label: string
  color: string
}

type UserProfileConnection = {
  platform: string
  username: string
  url: string
}

type UserProfileData = {
  name: string
  username: string
  status: "online" | "idle" | "dnd" | "offline"
  customStatus: string
  location: string
  bio: string
  memberSince: string
  links: UserProfileLink[]
  bannerUrl?: string | null
  roles?: UserProfileRole[]
  connections?: UserProfileConnection[]
  statusText?: string
}

interface UserProfileCardProps {
  user: UserProfileData
  avatarUrl?: string | null
  onEditProfile: () => void
}

const STATUS_TONE: Record<UserProfileData["status"], string> = {
  online: "bg-discord-green",
  idle: "bg-discord-yellow",
  dnd: "bg-discord-red",
  offline: "bg-discord-text-muted",
}

const PLATFORM_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  github: Github,
}

export function UserProfileCard({ user, avatarUrl, onEditProfile }: UserProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  const statusDisplay = user.statusText ?? user.bio

  return (
    <div className="relative overflow-hidden rounded-[24px] p-px shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[24px] bg-[linear-gradient(130deg,#5865F2_0%,#8B5CF6_22%,#06B6D4_45%,#10B981_68%,#A855F7_100%)]"
        style={{ backgroundSize: "220% 220%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative overflow-hidden rounded-[23px] bg-discord-dark">
        <div className="relative h-28 overflow-hidden">
          {user.bannerUrl ? (
            <img src={user.bannerUrl} alt={`${user.name} banner`} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(88,101,242,0.3),rgba(0,0,0,0.95))] bg-center" />
          )}
        </div>

        <div className="relative px-4 pb-4">
          <div className="-mt-10 mb-6">
            <div className="relative w-fit">
              <Avatar className="size-20 md:size-24 border-[6px] border-discord-dark">
                <AvatarImage src={avatarUrl ?? undefined} className="object-cover" />
                <AvatarFallback className="bg-discord-blurple text-2xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 flex size-5 md:size-6 items-center justify-center rounded-full bg-discord-dark">
                <span className={`size-3 md:size-4 rounded-full ${STATUS_TONE[user.status]}`} />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h2
              className="text-xl md:text-3xl font-bold pixel-text tracking-widest relative inline-block"
              style={{
                color: "#00ff88",
                textShadow: "0 0 4px rgba(0, 255, 136, 0.4), 0 0 8px rgba(0, 255, 136, 0.25)",
                paddingBottom: "0.1em",
              }}
            >
              {user.name}
            </h2>
            <p className="text-sm text-discord-text-muted">@{user.username}</p>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md bg-discord-blurple px-3 py-1.5 text-xs font-medium text-white transition hover:bg-discord-blurple/80">
              <UserPlus className="size-4" />
              Add Friend
            </button>
            <button className="flex items-center gap-1.5 rounded-md bg-discord-hover px-3 py-1.5 text-xs font-medium text-discord-text-primary transition hover:bg-discord-hover/80">
              <MessageCircle className="size-4" />
              Message
            </button>
            <button
              onClick={onEditProfile}
              className="flex items-center justify-center rounded-md bg-discord-hover size-8 text-discord-text-primary transition hover:bg-discord-hover/80"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>

          <div className="mb-3 flex items-center gap-2 text-sm text-discord-text-secondary">
            <MapPin className="size-4" />
            <span>{user.location}</span>
          </div>

          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-discord-text-muted mb-1">
              Status
            </p>
            <p className="text-sm text-discord-text-primary">{statusDisplay}</p>
          </div>

          <div className="h-px bg-discord-divider mb-3" />

          {user.roles && user.roles.length > 0 && (
            <>
              <div className="mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-discord-text-muted mb-2">
                  Roles
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.map((role) => (
                    <span
                      key={role.label}
                      className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        color: role.color,
                        borderColor: `color-mix(in oklch, ${role.color} 70%, transparent)`,
                        backgroundImage: `linear-gradient(120deg, color-mix(in oklch, ${role.color} 20%, transparent), color-mix(in oklch, ${role.color} 8%, transparent))`,
                      } as CSSProperties}
                    >
                      {role.label}
                    </span>
                  ))}
                </div>
              </div>

              {user.connections && user.connections.length > 0 && (
                <div className="h-px bg-discord-divider mb-3" />
              )}
            </>
          )}

          {user.connections && user.connections.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-discord-text-muted mb-2">
                Connections
              </p>
              <div className="space-y-2">
                {user.connections.map((conn) => {
                  const Icon = PLATFORM_ICONS[conn.platform.toLowerCase()]
                  return (
                    <a
                      key={conn.platform}
                      href={conn.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-discord-text-primary transition hover:underline"
                    >
                      {Icon && <Icon className="size-5 text-white" />}
                      <span className="font-semibold">{conn.platform}</span>
                      <span className="text-discord-text-secondary">{conn.username}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
