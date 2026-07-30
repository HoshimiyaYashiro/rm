import { cookies, headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query'

import config from '@/payload.config'
import { redirect } from 'next/navigation'
import HomeWrapper from '../components/home-wrapper'

export default async function AuthenticatedLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const cookieStore = await cookies()
  // Nếu chưa đăng nhập HOẶC token đã hết hạn, user sẽ trả về giá trị null
  if (!user) {
    // Điều hướng an toàn từ phía Server sang trang login
    // Đồng thời truyền kèm param 'redirect' để sau khi login xong quay lại trang chủ
    redirect('/auth/login?redirect=/')
  }
  if (user.role === 'A') {
    redirect('/admin')
  }
  // 1. Khởi tạo QueryClient ở tầng Server
  const queryClient = new QueryClient()
  // 2. Nạp (Prefetch) dữ liệu user vào cache với một 'queryKey' định sẵn
  await queryClient.prefetchQuery({
    queryKey: ['authUser'],
    queryFn: () => user, // Trả về trực tiếp dữ liệu user đã có từ Payload Auth
  })
  const jwt = cookieStore.get('payload-token')?.value || ''
  const dehydratedState = dehydrate(queryClient)
  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeWrapper user={user} jwt={jwt}>{children}</HomeWrapper>
    </HydrationBoundary>
  )
}
