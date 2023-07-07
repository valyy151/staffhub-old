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
  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workDay.findMany();
  }),
  findNotes: protectedProcedure
    .input(
      z.object({
        workDayId: z.string(),
      })
    )
    .query(async ({ input: { workDayId }, ctx }) => {
      return await ctx.prisma.workDayNote.findMany({
        where: { userId: ctx.session.user.id, workDayId },
      });
    }),
});
