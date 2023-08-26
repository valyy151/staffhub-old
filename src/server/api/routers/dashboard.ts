import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  find: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        value: z.date().optional(),
      })
    )
    .query(async ({ input: { skip, value }, ctx }) => {
      const hasEmployees = await ctx.prisma.employee.findFirstOrThrow({
        where: { userId: ctx.session.user.id },
      });

      if (!hasEmployees) {
        return [];
      }

      if (value) {
        const monthBegin = new Date(value.getFullYear(), value.getMonth(), 1);
        const workDaysPromise = ctx.prisma.workDay.findMany({
          where: {
            date: {
              gte: Math.floor(monthBegin.getTime() / 1000),
            },
          },
          take: 7,
        });

        const notesPromise = workDaysPromise.then((workDays) => {
          const workDaysIds = workDays.map((workDay) => workDay.id);
          return ctx.prisma.workDayNote.findMany({
            where: { workDayId: { in: workDaysIds } },
          });
        });

        const shiftsPromise = ctx.prisma.shift.findMany({
          where: {
            userId: ctx.session.user.id,
            date: {
              gte: Math.floor(monthBegin.getTime() / 1000),
            },
          },
        });

        const [notes, shifts, workDays] = await Promise.all([
          notesPromise,
          shiftsPromise,
          workDaysPromise,
        ]);

        return workDays.map((workDay) => {
          const dayNotes = notes.filter(
            (note) => note.workDayId === workDay.id
          );
          const dayShifts = shifts.filter(
            (shift) => shift.date === workDay.date
          );
          return { ...workDay, shifts: dayShifts, notes: dayNotes };
        });
      }

      const currentDate = Math.floor(Date.now() / 1000);

      const today = new Date();
      const currentDayOfWeek = today.getDay();

      const startOfWeek =
        currentDate - currentDayOfWeek * 24 * 60 * 60 + skip * 7 * 24 * 60 * 60;

      const endOfWeek = startOfWeek + 7 * 24 * 60 * 60;

      const workDaysPromise = ctx.prisma.workDay.findMany({
        where: { date: { lte: endOfWeek, gte: startOfWeek } },
      });

      const notesPromise = workDaysPromise.then((workDays) => {
        const workDaysIds = workDays.map((workDay) => workDay.id);
        return ctx.prisma.workDayNote.findMany({
          where: { workDayId: { in: workDaysIds } },
        });
      });

      const shiftsPromise = ctx.prisma.shift.findMany({
        where: {
          userId: ctx.session.user.id,
          date: { lte: endOfWeek, gte: startOfWeek },
        },
      });

      const [notes, shifts, workDays] = await Promise.all([
        notesPromise,
        shiftsPromise,
        workDaysPromise,
      ]);

      return workDays.map((workDay) => {
        const dayNotes = notes.filter((note) => note.workDayId === workDay.id);
        const dayShifts = shifts.filter((shift) => shift.date === workDay.date);
        return { ...workDay, shifts: dayShifts, notes: dayNotes };
      });
    }),

  findFirstAndLastDay: protectedProcedure.query(async ({ ctx }) => {
    const firstDay = await ctx.prisma.workDay.findFirst({
      select: { date: true },
      orderBy: { date: "asc" },
    });

    const lastDay = await ctx.prisma.workDay.findFirst({
      select: { date: true },
      orderBy: { date: "desc" },
    });

    return [firstDay, lastDay];
  }),
});
