import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const shiftRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        start: z.number(),
        workDayId: z.string(),
        employeeId: z.string(),
      })
    )
    .mutation(async ({ input: { start, end, workDayId, employeeId }, ctx }) => {
      return await ctx.prisma.shift.create({
        data: {
          end,
          start,
          workDayId,
          employeeId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
