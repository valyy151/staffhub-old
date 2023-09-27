import { expect, it } from 'vitest';

import {
    calculateTotalHours, calculateTotalMonthlyHours, howManyDays, isTimeGreaterThanTotalHours
} from '../calculateHours';

it("should calculate total hours", () => {
  const days = [
    {
      id: "1",
      date: 1693519200,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "1",
          start: 1693544400,
          end: 1693576800,
          date: 1693519200,
          roleId: null,
        },
      ],
    },
    {
      id: "2",
      date: 1693605600,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "2",
          start: 1693630800,
          end: 1693663200,
          date: 1693605600,
          roleId: null,
        },
      ],
    },
    {
      id: "3",
      date: 1693692000,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "3",
          start: 1693717200,
          end: 1693749600,
          date: 1693692000,
          roleId: null,
        },
      ],
    },
    {
      id: "4",
      date: 1693778400,
      vacation: false,
      sickLeave: false,
      shifts: [],
    },
    {
      id: "5",
      date: 1693864800,
      vacation: false,
      sickLeave: true,
      shifts: [],
    },
    {
      id: "6",
      date: 1693951200,
      vacation: false,
      sickLeave: true,
      shifts: [],
    },
    {
      id: "7",
      date: 1694037600,
      vacation: false,
      sickLeave: true,
      shifts: [],
    },
    {
      id: "8",
      date: 1694124000,
      vacation: false,
      sickLeave: true,
      shifts: [],
    },
    {
      id: "9",
      date: 1694210400,
      vacation: false,
      sickLeave: true,
      shifts: [],
    },
    {
      id: "10",
      date: 1694296800,
      vacation: false,
      sickLeave: false,
      shifts: [],
    },
    {
      id: "11",
      date: 1694383200,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "11",
          start: 1694408400,
          end: 1694440800,
          date: 1694383200,
          roleId: null,
        },
      ],
    },
    {
      id: "12",
      date: 1694469600,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "12",
          start: 1694494800,
          end: 1694527200,
          date: 1694469600,
          roleId: null,
        },
      ],
    },
    {
      id: "13",
      date: 1694556000,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "13",
          start: 1694581200,
          end: 1694613600,
          date: 1694556000,
          roleId: null,
        },
      ],
    },
    {
      id: "14",
      date: 1694642400,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "14",
          start: 1694667600,
          end: 1694700000,
          date: 1694642400,
          roleId: null,
        },
      ],
    },
    {
      id: "15",
      date: 1694728800,
      vacation: false,
      sickLeave: false,
      shifts: [],
    },
    {
      id: "16",
      date: 1694815200,
      vacation: false,
      sickLeave: false,
      shifts: [],
    },
    {
      id: "17",
      date: 1694901600,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "17",
          start: 1694959200,
          end: 1694988000,
          date: 1694901600,
          roleId: null,
        },
      ],
    },
    {
      id: "18",
      date: 1694988000,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "18",
          start: 1695045600,
          end: 1695074400,
          date: 1694988000,
          roleId: null,
        },
      ],
    },
    {
      id: "19",
      date: 1695074400,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "19",
          start: 1695132000,
          end: 1695160800,
          date: 1695074400,
          roleId: null,
        },
      ],
    },
    {
      id: "20",
      date: 1695160800,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "20",
          start: 1695218400,
          end: 1695247200,
          date: 1695160800,
          roleId: null,
        },
      ],
    },
    {
      id: "21",
      date: 1695247200,
      vacation: false,
      sickLeave: false,
      shifts: [],
    },
    {
      id: "22",
      date: 1695333600,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "22",
          start: 1695391200,
          end: 1695420000,
          date: 1695333600,
          roleId: null,
        },
      ],
    },
    {
      id: "23",
      date: 1695420000,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "23",
          start: 1695477600,
          end: 1695506400,
          date: 1695420000,
          roleId: null,
        },
      ],
    },
    {
      id: "24",
      date: 1695506400,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "24",
          start: 1695564000,
          end: 1695592800,
          date: 1695506400,
          roleId: null,
        },
      ],
    },
    {
      id: "25",
      date: 1695592800,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "25",
          start: 1695650400,
          end: 1695679200,
          date: 1695592800,
          roleId: null,
        },
      ],
    },
    {
      id: "26",
      date: 1695679200,
      vacation: false,
      sickLeave: false,
      shifts: [],
    },
    {
      id: "27",
      date: 1695765600,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "27",
          start: 1695823200,
          end: 1695852000,
          date: 1695765600,
          roleId: null,
        },
      ],
    },
    {
      id: "28",
      date: 1695852000,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "28",
          start: 1695909600,
          end: 1695938400,
          date: 1695852000,
          roleId: null,
        },
      ],
    },
    {
      id: "29",
      date: 1695938400,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "29",
          start: 1695996000,
          end: 1696024800,
          date: 1695938400,
          roleId: null,
        },
      ],
    },
    {
      id: "30",
      date: 1696024800,
      vacation: false,
      sickLeave: false,
      shifts: [
        {
          id: "clm7iyhtd000msbokgxxnsrb9",
          start: 1696082400,
          end: 1696111200,
          date: 1696024800,
          roleId: null,
        },
      ],
    },
  ];

  const totalHours = calculateTotalHours(days);

  expect(totalHours).toBe(159);
});

it("should calculate total monthly hours", () => {
  const schedule = [
    {
      date: 1693519200,
      start: 1693544400,
      end: 1693576800,
    },
    {
      date: 1693605600,
      start: 1693630800,
      end: 1693663200,
    },
    {
      date: 1693692000,
      start: 1693717200,
      end: 1693749600,
    },
    {
      date: 1693778400,
    },
    {
      date: 1693864800,
    },
    {
      date: 1693951200,
    },
    {
      date: 1694037600,
    },
    {
      date: 1694124000,
    },
    {
      date: 1694210400,
    },
    {
      date: 1694296800,
    },
    {
      date: 1694383200,
      start: 1694440800,
      end: 1694469600,
    },
    {
      date: 1694469600,
      start: 1694527200,
      end: 1694556000,
    },
    {
      date: 1694556000,
      start: 1694613600,
      end: 1694642400,
    },
    {
      date: 1694642400,
    },
    {
      date: 1694728800,
      start: 1694786400,
      end: 1694815200,
    },
    {
      date: 1694815200,
      start: 1694872800,
      end: 1694901600,
    },
    {
      date: 1694901600,
      start: 1694959200,
      end: 1694988000,
    },
    {
      date: 1694988000,
      start: 1695045600,
      end: 1695074400,
    },
    {
      date: 1695074400,
    },
    {
      date: 1695160800,
    },
    {
      date: 1695247200,
      start: 1695304800,
      end: 1695333600,
    },
    {
      date: 1695333600,
      start: 1695391200,
      end: 1695420000,
    },
    {
      date: 1695420000,
      start: 1695477600,
      end: 1695506400,
    },
    {
      date: 1695506400,
      start: 1695564000,
      end: 1695592800,
    },
    {
      date: 1695592800,
    },
    {
      date: 1695679200,
    },
    {
      date: 1695765600,
      start: 1695823200,
      end: 1695852000,
    },
    {
      date: 1695852000,
    },
    {
      date: 1695938400,
    },
    {
      date: 1696024800,
    },
  ];

  const schedule2 = [
    {
      date: 1693519200,
      start: 1693544400,
      end: 1693576800,
    },
    {
      date: 1693605600,
      start: 1693630800,
      end: 1693663200,
    },
    {
      date: 1693692000,
      start: 1693717200,
      end: 1693749600,
    },
    {
      date: 1693778400,
    },
    {
      date: 1693864800,
    },
    {
      date: 1693951200,
    },
    {
      date: 1694037600,
    },
    {
      date: 1694124000,
    },
    {
      date: 1694210400,
    },
    {
      date: 1694296800,
    },
    {
      date: 1694383200,
      start: 1694440800,
      end: 1694469600,
    },
    {
      date: 1694469600,
      start: 1694527200,
      end: 1694556000,
    },
    {
      date: 1694556000,
      start: 1694613600,
      end: 1694642400,
    },
    {
      date: 1694642400,
    },
    {
      date: 1694728800,
      start: 1694786400,
      end: 1694815200,
    },
    {
      date: 1694815200,
      start: 1694872800,
      end: 1694901600,
    },
    {
      date: 1694901600,
      start: 1694959200,
      end: 1694988000,
    },
    {
      date: 1694988000,
      start: 1695045600,
      end: 1695074400,
    },
    {
      date: 1695074400,
    },
    {
      date: 1695160800,
    },
    {
      date: 1695247200,
      start: 1695304800,
      end: 1695333600,
    },
    {
      date: 1695333600,
      start: 1695391200,
      end: 1695420000,
    },
    {
      date: 1695420000,
      start: 1695477600,
      end: 1695506400,
    },
    {
      date: 1695506400,
      start: 1695564900,
      end: 1695592800,
    },
    {
      date: 1695592800,
    },
    {
      date: 1695679200,
    },
    {
      date: 1695765600,
      start: 1695823200,
      end: 1695852000,
    },
    {
      date: 1695852000,
    },
    {
      date: 1695938400,
    },
    {
      date: 1696024800,
    },
  ];

  const totalHours = calculateTotalMonthlyHours(schedule, 0, 5);

  const totalHours2 = calculateTotalMonthlyHours(schedule, 5, 0);

  const totalHours3 = calculateTotalMonthlyHours(schedule, 2, 5);

  const totalHours4 = calculateTotalMonthlyHours(schedule2, 0, 5);

  const totalHours5 = calculateTotalMonthlyHours(schedule2, 0, 0);

  expect(totalHours).toBe("163h");

  expect(totalHours2).toBe("163h");

  expect(totalHours3).toBe("179h");

  expect(totalHours4).toBe("162h 45min");

  expect(totalHours5).toBe("122h 45min");
});

it("should check if time is greater than total hours", () => {
  const timeString = "163h";
  const totalHoursPerMonth = 163;

  const timeString2 = "163h 30min";
  const totalHoursPerMonth2 = 163;

  const timeString3 = "163h 30min";
  const totalHoursPerMonth3 = 165;

  const timeString4 = "151h 45min";
  const totalHoursPerMonth4 = 162;

  const isGreater = isTimeGreaterThanTotalHours(timeString, totalHoursPerMonth);

  const isGreater2 = isTimeGreaterThanTotalHours(
    timeString2,
    totalHoursPerMonth2
  );

  const isGreater3 = isTimeGreaterThanTotalHours(
    timeString3,
    totalHoursPerMonth3
  );

  const isGreater4 = isTimeGreaterThanTotalHours(
    timeString4,
    totalHoursPerMonth4
  );

  expect(isGreater).toBe(true);

  expect(isGreater2).toBe(true);

  expect(isGreater3).toBe(false);

  expect(isGreater4).toBe(false);
});

it("should calculate how many days", () => {
  const start = BigInt(1693519200000);
  const end = BigInt(1694469600000);

  const days = howManyDays({ start, end });

  expect(days).toBe(11);
});
