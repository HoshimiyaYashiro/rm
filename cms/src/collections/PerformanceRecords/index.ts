import type { CollectionConfig } from 'payload'

export const PerformanceRecords: CollectionConfig = {
  slug: 'performance-records',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'start', type: 'text', required: true },
    { name: 'end', type: 'text', required: false },
    {
      name: 'type', type: 'select', options: [
        { label: 'Month', value: 'M' },
        { label: 'Quarter', value: 'Q' },
        { label: 'Year', value: 'Y' },
      ], required: true
    },
    {
      name: 'status', type: 'select', options: [
        { label: 'Draft Registration', value: 'DR' },
        { label: 'Pending Registration', value: 'PR' },
        { label: 'Approved Registration', value: 'AR' },
        { label: 'Draft Summary', value: 'DS' },
        { label: 'Pending Summary', value: 'PS' },
        { label: 'Approved Summary', value: 'AS' },
      ], required: true
    },
    { name: 'registeredDays', type: 'number', required: true },
    { name: 'workingDays', type: 'number', required: false },
    { name: 'goals', type: 'json', required: true },
    { name: 'managementPoint', type: 'number', required: false },
    { name: 'customerPoint', type: 'number', required: false },
    { name: 'performance', type: 'number', required: false },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'approvalBy', type: 'join', collection: 'approval', on: 'record' },
  ],
}
