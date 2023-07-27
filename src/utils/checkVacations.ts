// function that will loop through vacations and check if the vacation is in the future, in the past, or ongoing

export function checkVacations(
  vacations: { id: string; start: bigint; end: bigint }[]
): [
  { id: string; start: bigint; end: bigint }[],
  { id: string; start: bigint; end: bigint }[],
  { id: string; start: bigint; end: bigint }?
] {
  const today = new Date().getTime();

  const currentVacation = vacations.find((vacation) => {
    return vacation.start < BigInt(today) && vacation.end > BigInt(today);
  });

  const futureVacations = vacations.filter((vacation) => {
    return vacation.start > BigInt(today);
  });

  const pastVacations = vacations.filter((vacation) => {
    return vacation.end < BigInt(today);
  });

  return [futureVacations, pastVacations, currentVacation];
}

export function howManyDays({ start, end }: { start: bigint; end: bigint }) {
  const days = (end - start) / BigInt(86400000);
  return Number(days);
}
