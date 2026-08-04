import { DateTime } from 'luxon';

export const countBusinessDays = (year: number, month: number) => {
  let start = DateTime.local(year, month, 1).startOf('month');
  let end = DateTime.local(year, month, 1).endOf('month');
  
  let count = 0;
  let current = start;

  while (current <= end) {
    // weekday từ 1 (Thứ 2) đến 5 (Thứ 6) là ngày làm việc
    if (current.weekday <= 5) {
      count++;
    }
    current = current.plus({ days: 1 });
  }

  return count;
}