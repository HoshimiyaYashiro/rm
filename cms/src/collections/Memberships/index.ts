import type { CollectionConfig } from 'payload'

export const Memberships: CollectionConfig = {
  slug: 'memberships',
  fields: [
    { name: 'group', type: 'relationship', relationTo: 'groups', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'role', type: 'select', options: [
        { label: 'Director', value: 'DR' },
        { label: 'Vice Director', value: 'VD' },
        { label: 'Manager', value: 'MN' },
        { label: 'Deputy Manager', value: 'DM' },
        { label: 'Leader', value: 'LD' },
        { label: 'Member', value: 'MB' },
      ], required: true
    },
  ],
}
