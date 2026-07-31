import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from '@/payload-types'

export const apiUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api';

export const payloadSDK = new PayloadSDK<Config>({
  baseURL: apiUrl,
})       