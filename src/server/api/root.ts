import { createTRPCRouter } from "~/server/api/trpc";
import { employeeRouter } from "./routers/employee";
import { workDayRouter } from "./routers/workDay";
import { shiftRouter } from "./routers/shift";
import { dashboardRouter } from "./routers/dashboard";
import { employeeNoteRouter } from "./routers/employeeNote";
import { shiftPreferenceRouter } from "./routers/shiftPreference";
import { vacationRouter } from "./routers/vacation";
import { workDayNoteRouter } from "./routers/workDayNote";

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
  workDayNote: workDayNoteRouter,
  employeeNote: employeeNoteRouter,
  shiftPreference: shiftPreferenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
