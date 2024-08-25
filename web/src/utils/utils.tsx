import { weekDays } from "./constants";

export function weekDaysSelected(days: string[]): string {
  const daysSeletected = days?.map(day => `${weekDays[day]}`);
  let daysFormated: string;

  if (daysSeletected?.length === 1) {
    daysFormated = daysSeletected[0];
  } else {
    daysFormated = daysSeletected?.slice(0, -1).join(', ') + ' e ' + daysSeletected[daysSeletected?.length - 1];
  }
 return daysFormated;
}