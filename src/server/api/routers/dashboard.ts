import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  find: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        skip: z.number(),
      })
    )
    .query(async ({ input: { skip, date }, ctx }) => {
      const hasEmployees = await ctx.prisma.employee.findFirstOrThrow({
        where: { userId: ctx.session.user.id },
      });

      if (!hasEmployees) {
        return [];
      }

      const startOfWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() + skip * 7 + 1
      );

      const workDaysPromise = ctx.prisma.workDay.findMany({
        where: {
          date: { gte: startOfWeek.getTime() / 1000 },
        },
        take: 7,
        orderBy: { date: "asc" },
      });

      const notesPromise = workDaysPromise.then((workDays) => {
        const workDaysIds = workDays.map((workDay) => workDay.id);
        return ctx.prisma.workDayNote.findMany({
          where: {
            userId: ctx.session.user.id,
            workDayId: { in: workDaysIds },
          },
        });
      });

      const shiftsPromise = ctx.prisma.shift.findMany({
        where: {
          userId: ctx.session.user.id,
          date: { gte: startOfWeek.getTime() / 1000 },
        },
        select: {
          employee: {
            select: {
              id: true,
              name: true,
              sickLeaves: true,
            },
          },
          date: true,
          id: true,
          start: true,
          end: true,
          absent: true,
        },
        orderBy: { date: "asc" },
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
