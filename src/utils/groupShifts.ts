export default function groupShifts(
  shifts: { start: number; end: number; count: number }[]
) {
  const groupedShifts: { start: number; end: number; count: number }[] = [];

  shifts.forEach((shift) => {
    const lastGroupedShift = groupedShifts[groupedShifts.length - 1];
    if (
      lastGroupedShift &&
      lastGroupedShift.start === shift.start &&
      lastGroupedShift.end === shift.end
    ) {
      // If the shift has the same start and end times as the last grouped shift, increment the count
      lastGroupedShift.count++;
    } else {
      // If the shift is different, create a new grouped shift object
      groupedShifts.push({
        ...shift,
        count: 1,
      });
    }
  });

  return groupedShifts.sort((a, b) => a.start - b.start);
}
