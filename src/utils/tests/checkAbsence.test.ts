import { it, expect } from "vitest";
import { checkVacations } from "../checkVacations";
import { checkSickLeaves } from "../checkSickLeaves";
import { findVacationDays, findSickLeaveDays } from "../checkAbsence";

it("should return past sick leaves and current sick leave", () => {
  const today = BigInt(new Date().getTime());

  const sickLeaves = [
    {
      id: "1",
      end: BigInt(1691186400000),
      start: BigInt(1690840800000),
    },
    {
      id: "2",
      end: BigInt(1693432800000),
      start: BigInt(1693260000000),
    },
    {
      id: "3",
      end: BigInt(1692309600000),
      start: BigInt(1691532000000),
    },
    {
      id: "4",
      end: today + BigInt(1000000),
      start: today - BigInt(1000000),
    },
  ];

  const [pastSickLeaves, currentSickLeave] = checkSickLeaves(sickLeaves);

  expect(pastSickLeaves).toEqual([
    {
      id: "1",
      end: BigInt(1691186400000),
      start: BigInt(1690840800000),
    },
    {
      id: "2",
      end: BigInt(1693432800000),
      start: BigInt(1693260000000),
    },
    {
      id: "3",
      end: BigInt(1692309600000),
      start: BigInt(1691532000000),
    },
  ]);

  expect(currentSickLeave).toEqual({
    id: "4",
    end: today + BigInt(1000000),
    start: today - BigInt(1000000),
  });
});

it("should return vacation days", () => {
  const vacations = [
    {
      id: "1",
      end: BigInt(1691186400000),
      start: BigInt(1690840800000),
    },
    {
      id: "2",
      end: BigInt(1693432800000),
      start: BigInt(1693260000000),
    },
    {
      id: "3",
      end: BigInt(1692309600000),
      start: BigInt(1691532000000),
    },
  ];

  const schedule = [
    { date: 1690840800 },
    { date: 1690927200 },
    { date: 1691013600 },
    { date: 1691100000 },
    { date: 1691186400 },
    { date: 1691272800 },
    { date: 1691359200 },
  ];

  const vacationDays = findVacationDays(vacations, schedule);

  expect(vacationDays).toEqual([
    1690840800, 1690927200, 1691013600, 1691100000, 1691186400,
  ]);
});

it("should return sick leave days", () => {
  const sickLeaves = [
    {
      id: "1",
      end: BigInt(1691186400000),
      start: BigInt(1690840800000),
    },
    {
      id: "2",
      end: BigInt(1693432800000),
      start: BigInt(1693260000000),
    },
    {
      id: "3",
      end: BigInt(1692309600000),
      start: BigInt(1691532000000),
    },
  ];

  const schedule = [
    { date: 1690840800 },
    { date: 1690927200 },
    { date: 1691013600 },
    { date: 1691100000 },
    { date: 1691186400 },
    { date: 1691272800 },
    { date: 1691359200 },
  ];

  const sickLeaveDays = findSickLeaveDays(sickLeaves, schedule);

  expect(sickLeaveDays).toEqual([
    1690840800, 1690927200, 1691013600, 1691100000, 1691186400,
  ]);
});

it("should return past vacations, future vacations, and current vacation", () => {
  const today = BigInt(new Date().getTime());

  const vacations = [
    {
      id: "1",
      end: BigInt(1691186400000),
      start: BigInt(1690840800000),
    },
    {
      id: "2",
      end: BigInt(1693432800000),
      start: BigInt(1693260000000),
    },
    {
      id: "3",
      end: BigInt(1692309600000),
      start: BigInt(1691532000000),
    },
    {
      id: "4",
      end: today + BigInt(1000000),
      start: today - BigInt(1000000),
    },
    {
      id: "5",
      end: today + BigInt(2000000),
      start: today + BigInt(1000000),
    },
  ];

  const [pastVacations, futureVacations, currentVacation] =
    checkVacations(vacations);

  expect(pastVacations).toEqual([
    {
      id: "1",
      end: BigInt(1691186400000),
      start: BigInt(1690840800000),
    },
    {
      id: "2",
      end: BigInt(1693432800000),
      start: BigInt(1693260000000),
    },
    {
      id: "3",
      end: BigInt(1692309600000),
      start: BigInt(1691532000000),
    },
  ]);

  expect(futureVacations).toEqual([
    {
      id: "5",
      end: today + BigInt(2000000),
      start: today + BigInt(1000000),
    },
  ]);

  expect(currentVacation).toEqual({
    id: "4",
    end: today + BigInt(1000000),
    start: today - BigInt(1000000),
  });
});
