export function generateYearArray(year: number) {
  const daysInYear = 365 + (isLeapYear(year) ? 1 : 0);
  const startOfYear = new Date(year, 0, 1);
  const yearArray = [];

  for (let i = 0; i < daysInYear; i++) {
    const currentDate = new Date(
      startOfYear.getTime() + i * 24 * 60 * 60 * 1000
    );
    yearArray.push({ date: currentDate.getTime() / 1000 });
  }

  return yearArray;
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function updateMonthData(date: any) {
  const year = date.getFullYear();

  const monthIndex = date.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const data = new Array(daysInMonth).fill(null).map((_, index) => {
    const day = index + 1;
    const dateUnixTimestamp = new Date(year, monthIndex, day).getTime() / 1000;

    return {
      date: dateUnixTimestamp,
    };
  });
  return data;
}
