"use client"

import { LogOutIcon, CircleUserIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { logoutHandler } from "../services/auth-api"
import { authStore } from "../store/auth-store"
import { useRouter } from "next/navigation"
import { Spinner } from "./ui/spinner"
import { useSidebar } from "./ui/sidebar"
import { Avatar, Dropdown, Label } from "@heroui/react"

export function UserDropdown2({
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
    <Dropdown>
      <Dropdown.Trigger className="w-full h-full">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <Avatar.Image
              alt="Jane"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
            />
            <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <p className="truncate text-sm leading-none font-medium text-left">{user.name}</p>
            <p className="truncate text-xs leading-none text-muted-foreground pt-1">{user.email}</p>
          </div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image
                alt="Jane"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
              />
              <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="truncate text-sm leading-5 font-medium">{user.name}</p>
              <p className="truncate text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item id="new-project" textValue="New project">
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Account</Label>
              <CircleUserIcon className="size-3.5 text-muted-foreground" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Logout" variant="danger" onClick={handleLogout} isDisabled={isPending}>
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Log Out</Label>
              {!isPending
                ? <LogOutIcon className="size-3.5 text-danger" />
                : <Spinner className="size-3.5 text-danger" />
              }
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
