import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { HomeButton } from './home-button'
import { NavigationItem } from './navigation-item'
import type { Doc } from '../../../../convex/_generated/dataModel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from '../../ui/sidebar'

export function ServerRail() {
  // Fetch user's servers
  const servers = useQuery(api.servers.list)

  return (
    <Sidebar collapsible="icon" className="border-none bg-black" variant='inset'>
      <SidebarHeader className="bg-discord-darker pt-3 pb-0 flex flex-col items-center">
        <SidebarMenu className="gap-2 items-center w-full">
          <SidebarMenuItem className="w-full flex justify-center">
             <HomeButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      

      <SidebarContent className="bg-discord-darker scrollbar-none flex flex-col items-center gap-2 overflow-y-auto w-full">
        <SidebarMenu className="gap-2 items-center w-full px-0">
          {servers?.map((server: Doc<'servers'>) => (
            <SidebarMenuItem key={server._id} className="w-full flex justify-center">
              <NavigationItem
                id={server._id}
                name={server.name}
                imageUrl={server.imageUrl}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="bg-discord-divider w-8 mx-auto my-2" />
    </Sidebar>
  )
}
