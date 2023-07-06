import { createTRPCRouter } from "~/server/api/trpc";
import { employeeRouter } from "./routers/employee";
import { workDayRouter } from "./routers/workDay";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  employee: employeeRouter,
  workDay: workDayRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
