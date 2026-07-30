import React from 'react'
import { headers as getHeaders } from 'next/headers'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function AuthLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Nếu chưa đăng nhập HOẶC token đã hết hạn, user sẽ trả về giá trị null
  if (user) {
    redirect('/') 
  }
  return (
    <>{children}</>
  )
}
