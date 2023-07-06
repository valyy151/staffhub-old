import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const shiftRouter = createTRPCRouter({
  createShift: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        date: z.number(),
        start: z.number(),
        employeeId: z.string(),
      })
    )
    .mutation(async ({ input: { date, start, end, employeeId }, ctx }) => {
      const modifiedDate = new Date(date * 1000);
      modifiedDate.setHours(0, 0, 0, 0);

      const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);
      return await ctx.prisma.shift.createMany({
        data: {
          end,
          start,
          employeeId,
          date: midnightUnixCode,
          userId: ctx.session.user.id,
        },
      });
    }),
});
