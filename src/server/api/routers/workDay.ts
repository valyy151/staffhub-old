import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const workDayRouter = createTRPCRouter({
  yearExists: protectedProcedure
    .input(z.object({ date: z.number() }))
    .query(async ({ input: { date }, ctx }) => {
      const exists = await ctx.prisma.workDay.findUnique({
        where: { date },
      });

      if (!exists) {
        return false;
      }

      return true;
    }),

  createMany: protectedProcedure
    .input(z.array(z.object({ date: z.number() })))
    .mutation(async ({ input: yearArray, ctx }) => {
      return await ctx.prisma.workDay.createMany({
        data: yearArray.map((day) => {
          const modifiedDate = new Date(day.date * 1000);

          modifiedDate.setHours(0, 0, 0, 0);

          const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);
          return {
            date: midnightUnixCode,
          };
        }),
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workDay.findMany();
  }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const workDayPromise = ctx.prisma.workDay.findUnique({
        where: { id },
      });

      const shiftsPromise = workDayPromise.then((workDay) => {
        return ctx.prisma.shift.findMany({
          where: { date: workDay?.date, userId: ctx.session.user.id },
          include: { employee: { select: { name: true } } },
        });
      });

      const notesPromise = ctx.prisma.workDayNote.findMany({
        where: { workDayId: id, userId: ctx.session.user.id },
      });

      const [notes, shifts, workDay] = await Promise.all([
        notesPromise,
        shiftsPromise,
        workDayPromise,
      ]);

      return { ...workDay, notes, shifts };
    }),
});
