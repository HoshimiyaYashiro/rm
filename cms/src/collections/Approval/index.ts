import type { CollectionConfig } from 'payload'

export const Approval: CollectionConfig = {
  slug: 'approval',
  fields: [
    { name: 'approverOrder', type: 'number', required: true },
    {
      name: 'status', type: 'select', options: [
        { label: 'Pending Registration', value: 'PR' },
        { label: 'Approved Registration', value: 'AR' },
        { label: 'Pending Summary', value: 'PS' },
        { label: 'Approved Summary', value: 'AS' },
      ], required: true
    },
    { name: 'record', type: 'relationship', relationTo: 'performance-records' },
    { name: 'approver', type: 'relationship', relationTo: 'users' },
    { name: 'approverAt', type: 'text', required: false },
  ],
}
