import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

export function toGoogleCalendarUTC(date: string, time: string, tz: string) {
  const iso = `${date}T${time}:00`;
  const utc = fromZonedTime(iso, tz);
  return formatInTimeZone(utc, "UTC", "yyyyMMdd'T'HHmmss'Z'");
}
