export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export type MonthName = (typeof monthNames)[number];

// Plant.bloomMonths and the season selectors use 1 for January.
export const calendarMonths = monthNames.map((name, index) => ({
  name,
  number: index + 1,
  abbreviation: name.slice(0, 3),
  initial: name.charAt(0),
}));
