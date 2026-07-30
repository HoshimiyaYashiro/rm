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

const data = {
  navMain: [
    {
      title: "My Performance",
      url: "#",
      icon: (
        <FileTextIcon
        />
      ),
      isActive: true,
    },
    {
      title: "Performance Management",
      url: "#",
      icon: (
        <SheetIcon
        />
      ),
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: (
    //     <BookOpenIcon
    //     />
    //   ),
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  // navSecondary: [
  //   {
  //     title: "Support",
  //     url: "#",
  //     icon: (
  //       <LifeBuoyIcon
  //       />
  //     ),
  //   },
  //   {
  //     title: "Feedback",
  //     url: "#",
  //     icon: (
  //       <SendIcon
  //       />
  //     ),
  //   },
  // ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: (
  //       <FrameIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: (
  //       <PieChartIcon
  //       />
  //     ),
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: (
  //       <MapIcon
  //       />
  //     ),
  //   },
  //],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & { authUser: User }) {
  const { authUser } = props;
  const user = {
    name: authUser?.name || '',
    email: authUser?.email || '',
    avatar: '',
  }
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
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
