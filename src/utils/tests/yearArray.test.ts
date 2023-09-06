import { it, expect } from "vitest";
import { generateYearArray } from "../yearArray";

it("should generate year array", () => {
  const yearArray = generateYearArray(2021);
  expect(yearArray.length).toBe(365);
  expect(yearArray[0]?.date).toBe(1609455600);
  expect(yearArray[364]?.date).toBe(1640905200);

  const leapYearArray = generateYearArray(2020);
  expect(leapYearArray.length).toBe(366);
  expect(leapYearArray[0]?.date).toBe(1577833200);
  expect(leapYearArray[365]?.date).toBe(1609369200);
});
