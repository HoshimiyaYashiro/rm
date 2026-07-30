import { payloadSDK } from "@/lib/payload";

// Auth login operation
export async function loginHandler(data: { email: string, password: string }) {
  const result = await payloadSDK.login({
    collection: 'users',        
    data,
  })
  return result;
} 
