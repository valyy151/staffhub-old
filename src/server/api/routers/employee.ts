import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const employeeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        address: z.string(),
        phoneNumber: z.string(),
      })
    )
    .mutation(async ({ input: { name, email, address, phoneNumber }, ctx }) => {
      return await ctx.prisma.employee.create({
        data: {
          name,
          email,
          address,
          phoneNumber,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        address: z.string(),
        employeeId: z.string(),
        phoneNumber: z.string(),
      })
    )
    .mutation(
      async ({
        input: { employeeId, name, email, address, phoneNumber },
        ctx,
      }) => {
        return await ctx.prisma.employee.update({
          where: { id: employeeId },
          data: { name, email, address, phoneNumber },
        });
      }
    ),

  delete: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .mutation(async ({ input: { employeeId }, ctx }) => {
      return await ctx.prisma.employee.delete({
        where: { id: employeeId },
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.employee.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        vacations: true,
        sickLeaves: true,
        phoneNumber: true,
        shiftPreferences: true,
      },
    });
  }),

  findOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        endOfMonth: z.number().optional(),
        startOfMonth: z.number().optional(),
      })
    )
    .query(async ({ input: { id, endOfMonth, startOfMonth }, ctx }) => {
      const employeePromise = ctx.prisma.employee.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          notes: true,
          address: true,
          vacations: true,
          sickLeaves: true,
          phoneNumber: true,
          vacationDays: true,
          shiftPreferences: true,
        },
      });

      const notesPromise = ctx.prisma.employeeNote.findMany({
        where: { employeeId: id, userId: ctx.session.user.id },
        select: { id: true, content: true, createdAt: true },
      });

      const vacationsPromise = ctx.prisma.vacation.findMany({
        where: { employeeId: id, userId: ctx.session.user.id },
        select: { id: true, start: true, end: true },
      });

      const sickLeavesPromise = ctx.prisma.sickLeave.findMany({
        where: { employeeId: id, userId: ctx.session.user.id },
        select: { id: true, start: true, end: true },
      });

      const shiftPreferencesPromise = ctx.prisma.shiftPreference.findMany({
        where: { employeeId: id, userId: ctx.session.user.id },
        select: { id: true, content: true, createdAt: true },
      });

      const shiftsPromise = ctx.prisma.shift.findMany({
        where: { employeeId: id, date: { lte: endOfMonth, gte: startOfMonth } },
      });

      let workDaysPromise;

      if (endOfMonth && startOfMonth) {
        workDaysPromise = ctx.prisma.workDay.findMany({
          where: {
            date: { lte: endOfMonth, gte: startOfMonth },
          },
        });
      } else {
        workDaysPromise = Promise.resolve([]);
      }

      const [
        notes,
        shifts,
        employee,
        workDays,
        vacations,
        sickLeaves,
        shiftPreferences,
      ] = await Promise.all([
        notesPromise,
        shiftsPromise,
        employeePromise,
        workDaysPromise,
        vacationsPromise,
        sickLeavesPromise,
        shiftPreferencesPromise,
      ]);

      if (!endOfMonth || !startOfMonth) {
        return {
          ...employee,
          notes,
          vacations,
          sickLeaves,
          shiftPreferences,
          workDays: [],
        };
      }

      const newWorkDays = workDays.map((workDay) => {
        const dayShifts = shifts.filter((shift) => shift.date === workDay.date);
        return { ...workDay, shifts: dayShifts };
      });

      return {
        ...employee,
        notes,
        vacations,
        sickLeaves,
        shiftPreferences,
        workDays: newWorkDays,
      };
    }),
});
