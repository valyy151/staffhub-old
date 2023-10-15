type WorkDay = {
  vacation: boolean;
  sickLeave: boolean;
  shift:
    | {
        id: string;
        start: number;
        end: number;
        employeeId: string;
        userId: string;
        date: number;
        roleId: string | null;
        absenceId: string | null;
      }
    | undefined;
  id: string;
  date: number;
};

export function calculateTotalHours(days: WorkDay[]) {
  const totalHours = days?.reduce((acc: number, day: WorkDay) => {
    if (day.shift?.start && day.shift?.end) {
      const start = day.shift?.start;
      const end = day.shift?.end;
      const hours = (end - start) / 3600;
      return acc + hours;
    }
    return acc;
  }, 0);

  return totalHours;
}

export function calculateTotalMonthlyHours(
  days: { date: number; start?: number; end?: number }[],
  vacationDays?: number,
  sickLeaveDays?: number
) {
  let vacationHours = 0;
  let sickLeaveHours = 0;

  if (vacationDays) {
    vacationHours = vacationDays * 8;
  }

  if (sickLeaveDays) {
    sickLeaveHours = sickLeaveDays * 8;
  }

  const totalMinutes = days.reduce(
    (acc: number, day: { date: number; start?: number; end?: number }) => {
      if (day.start && day.end) {
        const start = day.start;
        const end = day.end;
        const seconds = end - start;
        const minutes = seconds / 60;
        return acc + minutes;
      }
      return acc;
    },
    0
  );

  const hours = Math.floor(totalMinutes / 60) + vacationHours + sickLeaveHours;

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
