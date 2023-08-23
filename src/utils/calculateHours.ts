interface Shift {
  start: number;
  end: number;
}

interface WorkDay {
  start?: number;
  end?: number;
  total?: number;
  date: number;
  shifts: Shift[];
}

export function calculateTotalHours(days: WorkDay[]) {
  const totalHours = days?.reduce((acc: number, day: WorkDay) => {
    const dayHours = day.shifts.reduce((dayAcc: number, shift: Shift) => {
      if (shift.start && shift.end) {
        const start = shift.start;
        const end = shift.end;
        const hours = (end - start) / 3600;
        return dayAcc + hours;
      } else {
        return dayAcc; // Skip shifts without start and end properties
      }
    }, 0);
    return acc + dayHours;
  }, 0);
  return totalHours;
}

export function calculateTotalMonthlyHours(
  days: WorkDay[],
  vacationDays?: number
) {
  let vacationHours = 0;

  if (vacationDays) {
    vacationHours = vacationDays * 8;
  }

  const totalMinutes = days.reduce((acc: number, day: WorkDay) => {
    if (day.start && day.end) {
      const start = day.start;
      const end = day.end;
      const seconds = end - start;
      const minutes = seconds / 60;
      return acc + minutes;
    }
    return acc;
  }, 0);

  const hours = Math.floor(totalMinutes / 60) + vacationHours;

  const minutes = Math.floor(totalMinutes % 60);

  if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}min`;
  }
}

export function isTimeGreaterThanTotalHours(
  timeString: string,
  totalHoursPerMonth: number
) {
  const timeParts = timeString.split(" ");
  let hours = 0;
  let minutes = 0;

  for (const part of timeParts) {
    if (part.includes("h")) {
      hours += parseInt(part);
    } else if (part.includes("min")) {
      minutes += parseInt(part);
    }
  }

  const totalTimeInHours = hours + minutes / 60;

  return totalTimeInHours >= totalHoursPerMonth;
}

export function howManyDays({ start, end }: { start: bigint; end: bigint }) {
  const days = (end - start) / BigInt(86400000);
  return Number(days);
}
