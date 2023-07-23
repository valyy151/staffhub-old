import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const workDayRouter = createTRPCRouter({
  yearExists: protectedProcedure
    .input(z.object({ date: z.number() }))
    .query(async ({ input: { date }, ctx }) => {
      const exists = await ctx.prisma.workDay.findUnique({
        where: { date },
      });

      if (exists) {
        return true;
      } else return false;
    }),

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

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const workDay = await ctx.prisma.workDay.findUnique({
        where: { id },
      });

      const shifts = await ctx.prisma.shift.findMany({
        where: { date: workDay?.date, userId: ctx.session.user.id },
        include: { employee: { select: { name: true } } },
      });

      const notes = await ctx.prisma.workDayNote.findMany({
        where: { workDayId: id, userId: ctx.session.user.id },
      });

      return { ...workDay, notes, shifts };
    }),
});
