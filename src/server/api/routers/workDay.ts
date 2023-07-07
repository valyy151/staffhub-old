import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const workDayRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        date: z.number(),
      })
    )
    .mutation(async ({ input: { date }, ctx }) => {
      const modifiedDate = new Date(date * 1000);

      modifiedDate.setHours(0, 0, 0, 0);
      const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);

      return await ctx.prisma.workDay.create({
        data: {
          date: midnightUnixCode,
          userId: ctx.session.user.id,
        },
      });
    }),
  find: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
      })
    )
    .query(async ({ input: { skip }, ctx }) => {
      const currentDate = Math.floor(Date.now() / 1000);

      const today = new Date();
      const currentDayOfWeek = today.getDay();

      const startOfWeek =
        currentDate - currentDayOfWeek * 24 * 60 * 60 + skip * 7 * 24 * 60 * 60;
      const endOfWeek = startOfWeek + 7 * 24 * 60 * 60;

      return await ctx.prisma.workDay.findMany({
        where: { date: { lte: endOfWeek, gte: startOfWeek } },
      });
    }),
});
