import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.employee.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const employee = await ctx.prisma.employee.findUnique({
        where: { id },
      });

      const vacations = await ctx.prisma.vacation.findMany({
        where: { employeeId: id, userId: ctx.session.user.id },
      });

      const notes = await ctx.prisma.employeeNote.findMany({
        where: { employeeId: id, userId: ctx.session.user.id },
      });

      const shiftPreferences = await ctx.prisma.shiftPreference.findMany({
        where: { employeeId: id, userId: ctx.session.user.id },
      });

      return { ...employee, vacations, notes, shiftPreferences };
    }),

  createNote: protectedProcedure
    .input(z.object({ employeeId: z.string(), content: z.string() }))
    .mutation(async ({ input: { employeeId, content }, ctx }) => {
      return await ctx.prisma.employeeNote.create({
        data: {
          content,
          employeeId,
          userId: ctx.session.user.id,
        },
      });
    }),

  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(async ({ input: { noteId }, ctx }) => {
      return await ctx.prisma.employeeNote.delete({
        where: { id: noteId },
      });
    }),

  updateNote: protectedProcedure
    .input(z.object({ noteId: z.string(), content: z.string() }))
    .mutation(async ({ input: { noteId, content }, ctx }) => {
      return await ctx.prisma.employeeNote.update({
        where: { id: noteId },
        data: { content },
      });
    }),

  createShiftPreference: protectedProcedure
    .input(z.object({ employeeId: z.string(), content: z.string() }))
    .mutation(async ({ input: { employeeId, content }, ctx }) => {
      return await ctx.prisma.shiftPreference.create({
        data: {
          content,
          employeeId,
          userId: ctx.session.user.id,
        },
      });
    }),

  deleteShiftPreference: protectedProcedure
    .input(z.object({ shiftPreferenceId: z.string() }))
    .mutation(async ({ input: { shiftPreferenceId }, ctx }) => {
      return await ctx.prisma.shiftPreference.delete({
        where: { id: shiftPreferenceId },
      });
    }),

  updateShiftPreference: protectedProcedure
    .input(z.object({ shiftPreferenceId: z.string(), content: z.string() }))
    .mutation(async ({ input: { shiftPreferenceId, content }, ctx }) => {
      return await ctx.prisma.shiftPreference.update({
        where: { id: shiftPreferenceId },
        data: { content },
      });
    }),

  updatePersonalInfo: protectedProcedure
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

  createVacation: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        start: z.number(),
        daysPlanned: z.number(),
        employeeId: z.string(),
        vacationDays: z.number(),
      })
    )
    .mutation(
      async ({
        input: { employeeId, end, start, daysPlanned, vacationDays },
        ctx,
      }) => {
        await ctx.prisma.employee.update({
          where: { id: employeeId },
          data: {
            vacationDays: vacationDays - daysPlanned,
          },
        });
        return await ctx.prisma.vacation.create({
          data: {
            employeeId,
            end,
            start,
            userId: ctx.session.user.id,
          },
        });
      }
    ),

  deleteVacation: protectedProcedure
    .input(
      z.object({
        totalDays: z.number(),
        employeeId: z.string(),
        vacationId: z.string(),
        vacationDays: z.number(),
      })
    )
    .mutation(
      async ({
        input: { vacationId, totalDays, vacationDays, employeeId },
        ctx,
      }) => {
        await ctx.prisma.employee.update({
          where: { id: employeeId },
          data: {
            vacationDays: vacationDays + totalDays,
          },
        });
        return await ctx.prisma.vacation.delete({
          where: { id: vacationId },
        });
      }
    ),

  updateVacationAmount: protectedProcedure
    .input(
      z.object({
        vacationDays: z.number(),
        employeeId: z.string(),
      })
    )
    .mutation(async ({ input: { vacationDays, employeeId }, ctx }) => {
      await ctx.prisma.employee.update({
        where: { id: employeeId },
        data: {
          vacationDays: vacationDays,
        },
      });
    }),
});
