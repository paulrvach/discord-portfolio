import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { GraduationCap, MapPin, Github, Code2 } from 'lucide-react'
import { ProfileCard, type ProfileConnection, type ProfileRole } from '../../components/discord/profile/profile-card'
import { ProfileTabsPanel } from '../../components/discord/profile/profile-tabs-panel'
import { ProfileBadge } from '../../components/discord/profile/types'
import { useIdentityStore } from '../../stores/identity-store'
import { BANNER_STORAGE_ID, GITHUB_ICON_STORAGE_ID } from '../../lib/constants'

export const Route = createFileRoute('/channels/@me')({
  component: DMHome,
})

function DMHome() {
  const bannerUrl = useQuery(api.storage.getUrl, { storageId: BANNER_STORAGE_ID })
  const avatarUrl = useIdentityStore((s) => s.avatarUrl)
  const githubIconUrl = useQuery(api.storage.getUrl, { storageId: GITHUB_ICON_STORAGE_ID })

  const profileBadges: ProfileBadge[] = [
    {
      id: 'location',
      icon: MapPin,
      colorClass: 'text-discord-blurple',
      bgClass: 'bg-discord-blurple/20 border border-discord-blurple/40',
      label: 'Location',
      value: 'Los Angeles, CA',
    },
    {
      id: 'education',
      icon: GraduationCap,
      colorClass: 'text-amber-300',
      bgClass: 'bg-amber-500/20 border border-amber-400/40',
      label: 'Education',
      value: 'Irvine Valley College',
      sublabel: 'Computer Science',
    },
    {
      id: 'github',
      icon: Github,
      colorClass: 'text-slate-100',
      bgClass: 'bg-slate-500/20 border border-slate-300/40',
      label: 'GitHub',
      value: '@paulvachon',
      href: 'https://github.com/paulvachon',
    },
    {
      id: 'code',
      icon: Code2,
      colorClass: 'text-emerald-300',
      bgClass: 'bg-emerald-500/20 border border-emerald-400/40',
      label: 'Status',
      value: 'Open to opportunities',
    },
  ]

  const roles: ProfileRole[] = [
    {
      id: 'role-1',
      label: 'Software Engineer',
      color: '#5865F2',
      avatarUrl: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png',
      animation: 'pop',
    },
    {
      id: 'role-2',
      label: 'Builder',
      color: '#57F287',
      avatarUrl: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',
      animation: 'bounce',
    },
    {
      id: 'role-3',
      label: 'Audiophile',
      color: '#FEE75C',
      avatarUrl: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png',
      animation: 'float',
    },
    {
      id: 'role-4',
      label: 'Gamer',
      color: '#EB459E',
      avatarUrl: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-14.png',
      animation: 'jitter',
    },
    {
      id: 'role-5',
      label: 'Artist',
      color: '#F97316',
      avatarUrl: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',
      animation: 'spin',
    },
    {
      id: 'role-6',
      label: 'CS Student',
      color: '#00B0F4',
      avatarUrl: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png',
      animation: 'glow',
    },
  ]

  const connections: ProfileConnection[] = [
    {
      id: 'linkedin',
      label: 'LinkedIn paul-vachon',
      href: 'https://www.linkedin.com/in/paul-vachon/',
    },
    {
      id: 'github',
      label: 'GitHub paulrvach',
      href: 'https://github.com/paulrvach',
      iconUrl: githubIconUrl,
    },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-discord-chat">
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 w-full max-w-[80%] mx-auto px-6 py-8">
        <div className="w-full lg:w-[360px] shrink-0">
          <ProfileCard
            bannerUrl={bannerUrl}
            avatarUrl={avatarUrl}
            profileBadges={profileBadges}
            name="Paul Vachon"
            username="paulvachon"
            statusText="Another Day in Pizza Paradise 🍕"
            location="Orange County, CA"
            roles={roles}
            connections={connections}
          />
        </div>
        <ProfileTabsPanel />
      </div>
    </div>
  )
}
