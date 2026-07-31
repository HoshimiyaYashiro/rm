"use client"

import * as React from "react"

import { NavMain } from "@/app/(frontend)/components/nav-main"
import { NavProjects } from "@/app/(frontend)/components/nav-projects"
import { NavSecondary } from "@/app/(frontend)/components/nav-secondary"
import { NavUser } from "@/app/(frontend)/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/(frontend)/components/ui/sidebar"
import { FileTextIcon, SheetIcon, } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { userQueries } from "../services/user-api"
import { User } from "@/payload-types"

const navPerformance = {
  title: "nav.performance",
  url: "/performance",
  icon: (
    <FileTextIcon
    />
  ),
  isActive: false,
}
const navApproval = {
  title: "nav.approval",
  url: "/approval",
  icon: (
    <SheetIcon
    />
  ),
  isActive: false,
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const { user } = props;
  const authUser = {
    name: user?.name || '',
    email: user?.email || '',
    avatar: '',
  }
  const navMain = [navPerformance, navApproval]
  navMain[0].isActive = true
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <img src="/assets/vds-logo.png" className="h-12 max-w-full"></img>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={authUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
