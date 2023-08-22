import { Vacation } from "@prisma/client";

export function checkEmployeeVacation(
  vacations: { id: string; start: bigint; end: bigint }[]
) {
  const currentDate = Date.now();

  for (const vacation of vacations) {
    const startDate: Date = new Date(Number(vacation.start));
    const endDate: Date = new Date(Number(vacation.end));

    if (
      Number(currentDate) >= Number(startDate) &&
      Number(currentDate) <= Number(endDate)
    ) {
      const remainingDays = Math.ceil(
        (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24)
      );

      return (
        <>
          {`On vacation till ${endDate.toLocaleDateString("en-GB")}`}
          {<br />}
          {`Ends in ${remainingDays} days`}
        </>
      );
    } else if (Number(currentDate) < Number(startDate)) {
      const remainingDays = Math.ceil(
        (Number(startDate) - currentDate) / (1000 * 60 * 60 * 24)
      );

      return `Leaving on vacation in ${remainingDays} ${
        remainingDays === 1 ? "day" : "days"
      }`;
    }
  }
  return "No upcoming vacations.";
}

export function checkSickLeave(
  sickLeaves: { id: string; start: bigint; end: bigint }[]
) {
  const currentDate = Date.now();

  for (const sickLeave of sickLeaves) {
    const startDate: Date = new Date(Number(sickLeave.start));
    const endDate: Date = new Date(Number(sickLeave.end));

    if (
      Number(currentDate) >= Number(startDate) &&
      Number(currentDate) <= Number(endDate)
    ) {
      const remainingDays = Math.ceil(
        (Number(endDate) - currentDate) / (1000 * 60 * 60 * 24)
      );

      return (
        <>
          {`On sick leave till ${endDate.toLocaleDateString("en-GB")}`}
          {<br />}
          {`Ends in ${remainingDays} days`}
        </>
      );
    }
  }
  return "Not on sick leave";
}

export function findVacationDays(
  vacations: { id: string; end: bigint; start: bigint }[] | undefined,
  schedule: any[] | undefined
) {
  const vacationDays: any[] = [];
  vacations?.forEach((vacation) => {
    schedule?.forEach((day) => {
      if (day.date * 1000 >= vacation.start && day.date * 1000 <= vacation.end)
        vacationDays.push(day.date);
    });
  });
  return vacationDays;
}
