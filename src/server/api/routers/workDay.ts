import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const workDayRouter = createTRPCRouter({
  createRoster: protectedProcedure
    .input(
      z.object({
        date: z.number(),
      })
    )
    .mutation(async ({ input: { date }, ctx }) => {
      const modifiedDate = new Date(date * 1000);
      modifiedDate.setHours(0, 0, 0, 0);

      const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);

      return await ctx.prisma.workDay.createMany({
        data: {
          date: midnightUnixCode,
          userId: ctx.session.user.id,
        },
      });
    }),
});
