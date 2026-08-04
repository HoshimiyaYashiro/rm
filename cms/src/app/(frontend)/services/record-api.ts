import { payloadSDK } from "@/lib/payload";
import { queryOptions } from "@tanstack/react-query";

export async function findRecord(limit = 10, page = 1) {
  try {
    const result: any = await payloadSDK.find({
      collection: 'performance-records',
      limit,
      page,
    })
    return result
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function findRecordById(id: number) {
  try {
    const result: any = await payloadSDK.findByID({
      id,
      collection: 'performance-records',
    })
    return result
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const recordQueries = {
  find: (limit?: number, page?: number) => queryOptions({
    queryKey: ['findRecord'],
    queryFn: () => findRecord(limit, page),
  }),
  findById: (id: number) => queryOptions({
    queryKey: ['findRecordById'],
    queryFn: () => findRecordById(id),
  }),
};