import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

export const formatAppointmentTime = (date, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) => {
  const zonedDate = utcToZonedTime(new Date(date), timeZone)
  return format(zonedDate, 'PPpp', { timeZone })
}

export const convertToUTC = (date, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) => {
  return zonedTimeToUtc(date, timeZone)
}

export const isOverlapping = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1
} 