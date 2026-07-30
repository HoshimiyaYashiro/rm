'use client'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import * as z from 'zod'
import { en } from 'zod/locales'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TooltipProvider } from '../components/ui/tooltip'

export function CustomClientProvider({ children, locale }: { children: React.ReactNode, locale: string }) {
  z.config(en())
  // Tạo QueryClient duy nhất cho mỗi instance của trình duyệt
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
      },
    },
  }))
  useEffect(() => {
    async function loadZodLocale() {
      try {
        // Tự động nạp động (Dynamic Import) gói ngôn ngữ tương ứng khi locale thay đổi
        // Lưu ý: Đường dẫn chính xác phụ thuộc vào bản bundler cấu hình của bạn
        if (locale !== 'en') {
          const { default: zodLocale } = await import(`zod/v4/locales/${locale}.js`)

          // Kích hoạt cấu hình ngôn ngữ lỗi toàn cục cho Zod
          z.config(zodLocale())
        } else {
          z.config(en())
        }
      } catch (error) {
        console.error(`Không thể nạp ngôn ngữ Zod cho mã: ${locale}`, error)

        // Nhánh dự phòng (Fallback) về Tiếng Anh mặc định nếu nạp lỗi
        z.config(en())
      }
    }

    loadZodLocale()
  }, [locale]) // Chạy lại logic ngay khi người dùng chọn ngôn ngữ mới

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}