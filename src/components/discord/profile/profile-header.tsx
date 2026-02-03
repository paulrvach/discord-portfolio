import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Separator } from '../../ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { cn } from '../../../lib/utils'
import { ProfileBadge } from './types'
import { ProfileBadges } from './profile-badges'

interface ProfileHeaderProps {
  bannerUrl?: string | null
  avatarUrl?: string | null
  profileBadges: ProfileBadge[]
  name: string
  username: string
  variant?: 'page' | 'card'
  showIdentity?: boolean
}

export function ProfileHeader({
  bannerUrl,
  avatarUrl,
  profileBadges,
  name,
  username,
  variant = 'page',
  showIdentity = true,
}: ProfileHeaderProps) {
  const isCard = variant === 'card'
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <section className="relative">
      <div
        className={cn(
          'w-full overflow-hidden',
          isCard ? 'h-28' : 'h-36 md:h-48'
        )}
      >
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

      <div className={cn(isCard ? 'px-4 pb-4' : 'px-4 md:px-6 pb-6')}>
        <div
          className={cn(
            'p-4',
            !isCard && 'bg-discord-dark rounded-lg border border-discord-divider'
          )}
        >
          <div className={cn('flex items-end gap-4 mb-4', isCard ? '-mt-10' : '-mt-14')}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <Avatar className="size-20 md:size-24 border-[6px] border-discord-dark ring-0">
                    <AvatarImage
                      src={
                        avatarUrl ??
                        'https://helpful-kingfisher-649.convex.cloud/api/storage/64ca8229-56a5-49da-9e05-41c63570f4b1'
                      }
                      alt={name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-discord-blurple text-2xl font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
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

            <ProfileBadges badges={profileBadges} />
          </div>

          {showIdentity && (
            <div className="space-y-2">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-discord-text-primary">
                  {name}
                </h1>
                <p className="text-sm text-discord-text-secondary">{username}</p>
              </div>

              <Separator className="bg-discord-divider" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
