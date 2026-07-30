import type { CollectionConfig } from 'payload'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    useAsTitle: 'label',
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'type', type: 'select', options: [
        { label: 'Department', value: 'D' },
        { label: 'Team', value: 'T' },
      ], required: true
    },
    { name: 'members', type: 'join', collection: 'memberships', on: 'group', required: false },
    {
      name: 'parent', type: 'relationship', relationTo: 'groups',
      filterOptions: ({ id }) => {
        // Nếu là tài liệu mới (chưa có ID), không cần lọc
        if (!id) return true

        // Nếu đã có ID, loại trừ nó bằng 'not_equals' hoặc 'not_in'
        return {
          id: {
            not_equals: id,
          },
        }
      },
      required: false
    },
  ],
}
