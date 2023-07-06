import { createTRPCRouter } from "~/server/api/trpc";
import { employeeRouter } from "./routers/employee";
import { workDayRouter } from "./routers/workDay";
import { shiftRouter } from "./routers/shift";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  shift: shiftRouter,
  workDay: workDayRouter,
  employee: employeeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
