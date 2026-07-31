"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/app/(frontend)/components/ui/sidebar"
import { UserDropdown } from "./user-dropdown"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email?: string
    avatar?: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserDropdown user={user}></UserDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
