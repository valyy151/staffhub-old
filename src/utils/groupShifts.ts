interface Shift {
  start: number;
  end: number;
  employee: { name: string };
  count: number;
}

const groupShifts = (shifts: Shift[]): Shift[] => {
  const groupedShifts: Shift[] = [];

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
};

export default groupShifts;
