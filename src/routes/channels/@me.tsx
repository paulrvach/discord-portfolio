import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { GraduationCap, MapPin, Github, Code2 } from 'lucide-react'
import { ProfileCard, type ProfileConnection, type ProfileRole } from '../../components/discord/profile/profile-card'
import { ProfileTabsPanel, type MutualServer } from '../../components/discord/profile/profile-tabs-panel'
import { ProfileBadge } from '../../components/discord/profile/types'

const BANNER_STORAGE_ID = 'kg20412jssev9jrjnphk7c75e98013hv'
const AVATAR_STORAGE_ID = 'kg22ekd3tpraawxc6q7gg1tyw58018ha'
const GITHUB_ICON_STORAGE_ID = 'kg24xc30sp8njsr8kg9nd82eg9801tf9'

export const Route = createFileRoute('/channels/@me')({
  component: DMHome,
})

function DMHome() {
  const bannerUrl = useQuery(api.storage.getUrl, { storageId: BANNER_STORAGE_ID })
  const avatarUrl = useQuery(api.storage.getUrl, { storageId: AVATAR_STORAGE_ID })
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
      id: 'github',
      label: 'github.com/paulvachon',
      href: 'https://github.com/paulvachon',
      iconUrl: githubIconUrl,
    },
    {
      id: 'website',
      label: 'paulvachon.dev',
      href: 'https://paulvachon.dev',
    },
    {
      id: 'twitter',
      label: '@paulvdev',
      href: 'https://twitter.com/paulvdev',
    },
  ]

  const mutualServers: MutualServer[] = [
    { id: 'server-1', name: 'Portfolio Lab', description: '1 mutual server' },
    { id: 'server-2', name: 'Open Source', description: '3 mutual servers' },
    { id: 'server-3', name: 'Audio Projects', description: '2 mutual servers' },
  ]

  return (
    <div className="flex-1 flex min-h-0 bg-discord-chat overflow-y-auto">
      <main className="flex-1">
        <section className="px-6 py-8">
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-[360px] shrink-0">
              <ProfileCard
                bannerUrl={bannerUrl}
                avatarUrl={avatarUrl}
                profileBadges={profileBadges}
                name="Paul Vachon"
                username="paulvachon"
                statusText="Buildin cool stuff"
                location="Los Angeles, CA"
                bio="When I'm on the roaaaaaad I see things going byyyyy."
                memberSince="Feb 24, 2020"
                roles={roles}
                connections={connections}
              />
            </div>
            <ProfileTabsPanel mutualServers={mutualServers} />
          </div>
        </section>
      </main>
    </div>
  )
}
