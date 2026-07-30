import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from '@/payload-types'

export const payloadSDK = new PayloadSDK<Config>({
  baseURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api',
})       