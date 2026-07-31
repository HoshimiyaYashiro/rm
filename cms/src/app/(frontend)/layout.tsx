import React from 'react'
import { Geist } from 'next/font/google'
import { Inter } from 'next/font/google'
import '../styles/globals.scss';
import './styles.css'
import { CustomClientProvider } from './providers/custom-client-provider'
import { NextIntlClientProvider } from 'next-intl'
import { cookies, headers } from "next/headers"
import { DEFAULT_LANG } from '@/constants/config'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

const geist = Geist({
  subsets: ['latin'],
})

const inter = Inter({
  subsets: ['latin'],
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LANG;

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.className} ${geist.className}`}>
      <body className="bg-background text-foreground">
        <NextIntlClientProvider>
          <CustomClientProvider locale={locale}>
            <main>{children}</main>
          </CustomClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
