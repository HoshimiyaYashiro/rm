import { payloadSDK } from "@/lib/payload";
import { queryOptions } from "@tanstack/react-query";

// Auth login operation
export async function fetchMe() {
  try {
    const result: any = await payloadSDK.me({
      collection: 'users',
    })
    return result.user
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const userQueries = {
  all: () => ['users'] as const,
  me: () => queryOptions({
    queryKey: ['authUser'],
    queryFn: () => fetchMe(),
  }),
};