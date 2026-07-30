import type { CollectionConfig } from 'payload'

export const PerformanceRecords: CollectionConfig = {
  slug: 'performance-records',
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'type', type: 'select', options: [
        { label: 'Month', value: 'M' },
        { label: 'Quarter', value: 'Q' },
        { label: 'Year', value: 'Y' },
      ], required: true
    },
    {
      name: 'status', type: 'select', options: [
        { label: 'Start Draft', value: 'SD' },
        { label: 'Start Approval', value: 'SA' },
        { label: 'End Draft', value: 'ED' },
        { label: 'End Approval', value: 'EA' },
      ], required: true
    },
    { name: 'registeredDays', type: 'number', required: false },
    { name: 'workingDays', type: 'number', required: false },
    { name: 'goals', type: 'json', required: true },
    { name: 'performance', type: 'number', required: false },
    { name: 'user', type: 'relationship', relationTo: 'users' },
  ],
}
