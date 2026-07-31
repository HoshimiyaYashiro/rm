import { apiUrl, payloadSDK } from "@/lib/payload";

export async function loginHandler(data: { email: string, password: string }) {
  const req = await payloadSDK.login({
    collection: 'users',        
    data,
  })
  return req;
} 

export async function logoutHandler() {
  const req = await fetch(`${apiUrl}/users/logout`, {
    method: "POST", 
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await req.json()
  return data;
} 