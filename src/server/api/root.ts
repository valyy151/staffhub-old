import { shiftRouter } from "./routers/shift";
import { workDayRouter } from "./routers/workDay";
import { employeeRouter } from "./routers/employee";
import { createTRPCRouter } from "~/server/api/trpc";
import { vacationRouter } from "./routers/vacation";
import { dashboardRouter } from "./routers/dashboard";
import { sickLeaveRouter } from "./routers/sickLeave";
import { workDayNoteRouter } from "./routers/workDayNote";
import { employeeNoteRouter } from "./routers/employeeNote";
import { shiftPreferenceRouter } from "./routers/shiftPreference";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  shift: shiftRouter,
  workDay: workDayRouter,
  vacation: vacationRouter,
  employee: employeeRouter,
  dashboard: dashboardRouter,
  sickLeave: sickLeaveRouter,
  workDayNote: workDayNoteRouter,
  employeeNote: employeeNoteRouter,
  shiftPreference: shiftPreferenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
