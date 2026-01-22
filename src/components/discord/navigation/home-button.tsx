import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '../../../lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip'

export function HomeButton() {
  const location = useLocation()
  const isActive = location.pathname === '/channels/@me'

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group">
            {/* Notification Pill */}
            <div
              className={cn(
                'notification-pill h-0 group-hover:h-5',
                isActive && 'h-10'
              )}
            />
            
            <Link to="/channels/@me">
              <div
                className={cn(
                  'server-icon bg-discord-dark group-hover:bg-discord-blurple group-hover:rounded-2xl',
                  isActive && 'bg-discord-blurple rounded-2xl'
                )}
              >
                {/* Discord Logo SVG */}
                <svg
                  className="w-7 h-5"
                  viewBox="0 0 28 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7187 1.67969C21.8906 0.820312 19.9297 0.1875 17.875 0C17.6328 0.4375 17.3516 1.02344 17.1641 1.48438C14.9766 1.31641 12.8047 1.31641 10.6484 1.48438C10.4609 1.02344 10.1719 0.4375 9.92969 0C7.875 0.1875 5.90625 0.820312 4.08594 1.67969C0.585938 6.85156 -0.359375 11.8906 0.117188 16.8516C2.57031 18.6328 4.94531 19.7031 7.27344 20.3984C7.82031 19.6406 8.3125 18.8359 8.73438 17.9922C7.91406 17.6953 7.13281 17.3281 6.39844 16.8906C6.58594 16.7578 6.76562 16.6172 6.94531 16.4766C11.2266 18.4609 15.8516 18.4609 20.0781 16.4766C20.2578 16.6172 20.4375 16.7578 20.625 16.8906C19.8906 17.3281 19.1016 17.6953 18.2891 17.9922C18.7109 18.8359 19.2031 19.6406 19.75 20.3984C22.0781 19.7031 24.4609 18.6328 26.9141 16.8516C27.4688 11.1094 25.9531 6.11719 23.7187 1.67969ZM9.01562 13.8047C7.6875 13.8047 6.60156 12.5859 6.60156 11.1016C6.60156 9.61719 7.66406 8.39844 9.01562 8.39844C10.3672 8.39844 11.4531 9.61719 11.4297 11.1016C11.4297 12.5859 10.3672 13.8047 9.01562 13.8047ZM18.0156 13.8047C16.6875 13.8047 15.6016 12.5859 15.6016 11.1016C15.6016 9.61719 16.6641 8.39844 18.0156 8.39844C19.3672 8.39844 20.4531 9.61719 20.4297 11.1016C20.4297 12.5859 19.3672 13.8047 18.0156 13.8047Z"
                    fill="currentColor"
                    className="text-discord-text-primary"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-discord-darker border-none">
          <p className="font-semibold">Direct Messages</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
