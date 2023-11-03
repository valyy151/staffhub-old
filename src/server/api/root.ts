import { createTRPCRouter } from "~/server/api/trpc";

import { dashboardRouter } from "./routers/dashboard";
import { employeeRouter } from "./routers/employee";
import { employeeNoteRouter } from "./routers/employeeNote";
import { schedulePreferenceRouter } from "./routers/schedulePreference";
import { shiftRouter } from "./routers/shift";
import { shiftModelRouter } from "./routers/shiftModel";
import { sickLeaveRouter } from "./routers/sickLeave";
import { staffRoleRouter } from "./routers/staffRole";
import { userRouter } from "./routers/user";
import { vacationRouter } from "./routers/vacation";
import { workDayRouter } from "./routers/workDay";
import { workDayNoteRouter } from "./routers/workDayNote";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  shift: shiftRouter,
  workDay: workDayRouter,
  vacation: vacationRouter,
  employee: employeeRouter,
  staffRole: staffRoleRouter,
  dashboard: dashboardRouter,
  sickLeave: sickLeaveRouter,
  shiftModel: shiftModelRouter,
  workDayNote: workDayNoteRouter,
  employeeNote: employeeNoteRouter,
  schedulePreference: schedulePreferenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
