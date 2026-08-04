import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: false, // default: false
    },
    tokenExpiration: 60 * 60 * 12
  },
  access: {
    admin: ({ req: { user } }) => {
      return user?.role === 'A' // Hoặc dùng .includes('A') nếu roles là mảng
    },
  },
  fields: [
    { name: 'username', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'role', type: 'select', options: [
        { label: 'Admin', value: 'A' },
        { label: 'Staff', value: 'S' },
        { label: 'User', value: 'U' },
      ], required: true
    },
    {
      name: 'dob', type: 'date', admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      }, required: false
    },
    { name: 'joinedGroups', type: 'join', collection: 'memberships', on: 'user' },
    { name: 'approved', type: 'join', collection: 'approval', on: 'approver' },
    // Email added by default
    // Add more fields as needed
  ],
}
