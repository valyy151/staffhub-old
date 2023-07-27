export function checkEmployeeVacation(
  vacations: { id: string; start: bigint; end: bigint }[]
) {
  const currentDate: any = Date.now();

  for (const vacation of vacations) {
    const startDate: any = new Date(Number(vacation.start));
    const endDate: any = new Date(Number(vacation.end));

    if (currentDate >= startDate && currentDate <= endDate) {
      const remainingDays = Math.ceil(
        (endDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      return (
        <>
          {`On vacation till ${endDate.toLocaleDateString("en-GB")}`}
          {<br />}
          {`Ends in ${remainingDays} days`}
        </>
      );
    } else if (currentDate < startDate) {
      const remainingDays = Math.ceil(
        (startDate - currentDate) / (1000 * 60 * 60 * 24)
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
  const currentDate: any = Date.now();

  for (const sickLeave of sickLeaves) {
    const startDate: any = new Date(Number(sickLeave.start));
    const endDate: any = new Date(Number(sickLeave.end));

    if (currentDate >= startDate && currentDate <= endDate) {
      const remainingDays = Math.ceil(
        (endDate - currentDate) / (1000 * 60 * 60 * 24)
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
