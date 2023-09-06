import { it, expect } from "vitest";
import { calculateTotalHours } from "../calculateHours";

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
