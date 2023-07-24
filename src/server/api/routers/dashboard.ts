import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  find: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
      })
    )
    .query(async ({ input: { skip }, ctx }) => {
      const hasEmployees = await ctx.prisma.employee.findMany({
        where: { userId: ctx.session.user.id },
      });

      if (hasEmployees.length === 0) {
        return [];
      }

      const currentDate = Math.floor(Date.now() / 1000);

      const today = new Date();
      const currentDayOfWeek = today.getDay();

      const startOfWeek =
        currentDate - currentDayOfWeek * 24 * 60 * 60 + skip * 7 * 24 * 60 * 60;
      const endOfWeek = startOfWeek + 7 * 24 * 60 * 60;

      const workDays = await ctx.prisma.workDay.findMany({
        where: { date: { lte: endOfWeek, gte: startOfWeek } },
      });

      const workDaysIds = workDays.map((workDay) => workDay.id);

      const notes = await ctx.prisma.workDayNote.findMany({
        where: { workDayId: { in: workDaysIds } },
      });

      const shifts = await ctx.prisma.shift.findMany({
        where: {
          userId: ctx.session.user.id,
          date: { lte: endOfWeek, gte: startOfWeek },
        },
      });

      return workDays.map((workDay) => {
        const dayShifts = shifts.filter((shift) => shift.date === workDay.date);
        const dayNotes = notes.filter((note) => note.workDayId === workDay.id);
        return { ...workDay, shifts: dayShifts, notes: dayNotes };
      });
    }),
});
