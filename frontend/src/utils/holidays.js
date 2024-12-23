// Create a new file for holiday definitions
export const UKRAINIAN_HOLIDAYS = [
  // New Year
  { month: 0, day: 1 }, // January 1
  // Christmas (Orthodox)
  { month: 0, day: 7 }, // January 7
  // Christmas (Catholic)
  { month: 11, day: 25 }, // December 25
  // International Women's Day
  { month: 2, day: 8 }, // March 8
  // Orthodox Easter (2024) - Note: This changes yearly
  { month: 4, day: 5 }, // May 5, 2024
  // Labor Day
  { month: 4, day: 1 }, // May 1
  // Victory Day
  { month: 4, day: 9 }, // May 9
  // Constitution Day
  { month: 5, day: 28 }, // June 28
  // Independence Day
  { month: 7, day: 24 }, // August 24
  // Defenders Day
  { month: 9, day: 14 }, // October 14
];

export const isHoliday = (date) => {
  const month = date.getMonth();
  const day = date.getDate();

  return UKRAINIAN_HOLIDAYS.some(
    (holiday) => holiday.month === month && holiday.day === day
  );
};

export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};
