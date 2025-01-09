import { format, formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";

export const formatDate = (date) => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "yyyy-MM-dd");
};

export const formatTime = (date) => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "HH:mm");
};

export const formatDateTime = (
  date,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return formatInTimeZone(parsedDate, timeZone, "PPpp");
};

export const isOverlapping = (start1, end1, start2, end2) => {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  return s1 < e2 && s2 < e1;
};
