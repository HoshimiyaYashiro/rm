"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/(frontend)/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/(frontend)/components/ui/dropdown-menu"
import {
  SidebarMenuButton,
  useSidebar,
} from "@/app/(frontend)/components/ui/sidebar"
import { ChevronsUpDownIcon, SparklesIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon, CircleUserIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { logoutHandler } from "../services/auth-api"
import { authStore } from "../store/auth-store"
import { useRouter } from "next/navigation"
import { Spinner } from "./ui/spinner"
export function UserDropdown({
  user,
}: {
  user: {
    name: string
    email?: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const handleLogout = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await logoutHandler()
        console.log(result)
        if (result) {
          localStorage.removeItem('payload-token')
          authStore.set('reset')
          // Đăng nhập thành công, chuyển hướng người dùng
          router.push('/auth/login')
          router.refresh()
        }
      } catch (err: any) {
        console.error('Lỗi đăng xuất:', err)
        setError(err?.message || 'Lỗi đăng xuất.')
      }
    })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
        }
      >
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon
            />
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending} className="text-danger">
          {!isPending
            ? <LogOutIcon />
            : <Spinner />
          }
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
