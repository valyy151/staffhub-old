import { expect, it } from 'vitest';

import {
    formatDay, formatMonth, formatTime, formatTotal, getMonthBoundaryTimestamps
} from '../dateFormatting';

it("should return start and end of month", () => {
  const [start, end] = getMonthBoundaryTimestamps(new Date("2021-01-31"));
  expect(start).toBe(1609455600);
  expect(end).toBe(1612133999);

  const [start2, end2] = getMonthBoundaryTimestamps(new Date("2021-02-17"));

  expect(start2).toBe(1612134000);
  expect(end2).toBe(1614553199);

  const [start3, end3] = getMonthBoundaryTimestamps(new Date("2023-05-08"));

  expect(start3).toBe(1682892000);
  expect(end3).toBe(1685570399);

  const [start4, end4] = getMonthBoundaryTimestamps(new Date("2023-12-05"));
  expect(start4).toBe(1701385200);
  expect(end4).toBe(1704063599);
});

it("should format time", () => {
  const time = formatTime(1612134000);
  expect(time).toBe("00:00");

  const time2 = formatTime(1612135000);
  expect(time2).toBe("00:16");

  const time3 = formatTime(1612156000);
  expect(time3).toBe("06:06");

  const time4 = formatTime(16121695000);
  expect(time4).toBe("17:36");
});

it("should format day", () => {
  const day = formatDay(1612134000);
  expect(day).toBe("Monday");

  const day2 = formatDay(16142595000);
  expect(day2).toBe("Tuesday");

  const day3 = formatDay(16142695000);
  expect(day3).toBe("Wednesday");

  const day4 = formatDay(16143995000);
  expect(day4).toBe("Thursday");

  const day5 = formatDay(1609455600);
  expect(day5).toBe("Friday");

  const day6 = formatDay(16121795000);
  expect(day6).toBe("Saturday");

  const day7 = formatDay(1614553199);
  expect(day7).toBe("Sunday");
});

it("should format month", () => {
  const month = formatMonth(1609455600);
  expect(month).toBe("January 2021");

  const month2 = formatMonth(1614553199);
  expect(month2).toBe("February 2021");

  const month3 = formatMonth(1684905200);
  expect(month3).toBe("May 2023");

  const month4 = formatMonth(1685905200);
  expect(month4).toBe("June 2023");

  const month5 = formatMonth(1699955200);
  expect(month5).toBe("November 2023");

  const month6 = formatMonth(1992591020);
  expect(month6).toBe("February 2033");
});

it("should format total", () => {
  const total = formatTotal(1612134000, 1612135000);
  expect(total).toBe("16min");

  const total2 = formatTotal(1612134000, 1612139200);
  expect(total2).toBe("1h 26min");

  const total3 = formatTotal(1612134000, 1612156000);
  expect(total3).toBe("6h 6min");

  const total4 = formatTotal(1612134000, 1612175000);
  expect(total4).toBe("11h 23min");

  const total5 = formatTotal(1693976400, 1694005200);
  expect(total5).toBe("8h ");

  const total6 = formatTotal(1693976400, 1694019600);

  expect(total6).toBe("12h ");
});
