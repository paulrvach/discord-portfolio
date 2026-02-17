import { motion } from "framer-motion"
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"

type UserProfileLink = {
  label: string
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

export function UserProfileCard({ user, avatarUrl, onEditProfile }: UserProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative overflow-hidden rounded-[24px] p-px shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[24px] bg-[linear-gradient(130deg,#5865F2_0%,#8B5CF6_22%,#06B6D4_45%,#10B981_68%,#A855F7_100%)]"
        style={{ backgroundSize: "220% 220%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative overflow-hidden rounded-[23px] border border-white/10 bg-[rgba(18,19,26,0.72)] backdrop-blur-xl">
        <div className="relative h-24 overflow-hidden">
          {user.bannerUrl ? (
            <img src={user.bannerUrl} alt={`${user.name} banner`} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(110%_120%_at_0%_0%,rgba(88,101,242,0.78)_0%,rgba(88,101,242,0)_55%),radial-gradient(95%_90%_at_100%_0%,rgba(6,182,212,0.5)_0%,rgba(6,182,212,0)_60%),radial-gradient(120%_150%_at_50%_100%,rgba(168,85,247,0.32)_0%,rgba(168,85,247,0)_75%),linear-gradient(180deg,rgba(15,18,28,0.85)_0%,rgba(18,20,30,1)_100%)]" />
          )}
          <svg
            aria-hidden
            viewBox="0 0 320 96"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
            preserveAspectRatio="none"
          >
            <path d="M0 38C48 62 88 8 148 30C208 52 252 34 320 60V96H0Z" fill="rgba(255,255,255,0.18)" />
            <circle cx="58" cy="28" r="20" fill="rgba(255,255,255,0.11)" />
            <circle cx="252" cy="24" r="16" fill="rgba(255,255,255,0.09)" />
          </svg>
        </div>

        <div className="relative px-4 pb-4">
          <div className="-mt-10 flex items-end justify-between gap-3">
            <div className="relative">
              <Avatar className="size-20 border-[5px] border-[rgba(18,19,26,0.88)] ring-2 ring-white/10">
                <AvatarImage src={avatarUrl ?? undefined} className="object-cover" />
                <AvatarFallback className="bg-discord-blurple text-lg font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-[rgba(18,19,26,0.96)]">
                <span className={`size-3 rounded-full ${STATUS_TONE[user.status]}`} />
              </span>
            </div>
            <button
              onClick={onEditProfile}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-discord-text-primary transition hover:bg-white/20"
            >
              Edit Profile
            </button>
          </div>

          <div className="mt-3 space-y-3 rounded-2xl border border-white/12 bg-black/25 p-3 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-1 text-discord-text-primary">
                <span className="text-lg font-semibold tracking-tight">{user.name}</span>
                <Sparkles className="size-3.5 text-[#b4bdff]" />
              </div>
              <p className="text-xs text-discord-text-secondary">@{user.username}</p>
              <p className="mt-1 text-xs text-discord-text-primary/90">{user.customStatus}</p>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center gap-2 text-sm text-discord-text-primary">
              <MapPin className="size-4 text-discord-text-secondary" />
              <span>{user.location}</span>
            </div>

            <p className="text-sm leading-relaxed text-discord-text-primary/90">{user.bio}</p>

            <div className="space-y-1.5 rounded-xl bg-black/20 p-2.5">
              {user.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-discord-text-primary/90 transition hover:bg-white/10"
                >
                  <span className="capitalize">{link.label}</span>
                  <ArrowUpRight className="size-3.5 text-discord-text-secondary" />
                </a>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-discord-text-muted">
                Member Since
              </p>
              <p className="mt-1 text-sm text-discord-text-primary">{user.memberSince}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
