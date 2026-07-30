'use client'
import { User } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchMe, userQueries } from '../services/user-api'
import { authStore } from '../store/auth-store'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { Separator } from './ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'

export default function HomeWrapper({ user, jwt }: { user: User, jwt: string }) {
  // useQuery sẽ tự động lấy dữ liệu từ cache được đổ từ Server xuống
  const { data: authUser, refetch, isFetching, isError } = useQuery(userQueries.me());
  authStore.set('state', { isAuth: true, jwt })
  const jwtToken = authStore.get('jwt')
  useEffect(() => {
    refetch();
  }, [])
  return (
    <SidebarProvider>
      <AppSidebar authUser={authUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
