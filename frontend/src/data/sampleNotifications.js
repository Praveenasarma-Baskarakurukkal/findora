export const sampleNotifications = [
  {
    id: 7001,
    type: 'match',
    title: 'Potential Match Found',
    message: 'A found student ID may match your recently reported lost item.',
    is_read: false,
    created_at: '2026-03-13T09:20:00Z',
    found_item_id: 9001
  },
  {
    id: 7002,
    type: 'system',
    title: 'Claim Update',
    message: 'Your recent claim was reviewed by the security office.',
    is_read: true,
    created_at: '2026-03-12T14:05:00Z',
    found_item_id: null
  },
  {
    id: 7003,
    type: 'reminder',
    title: 'Keep Details Updated',
    message: 'Add clear item descriptions to improve matching accuracy.',
    is_read: false,
    created_at: '2026-03-11T08:10:00Z',
    found_item_id: null
  }
];