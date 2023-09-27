import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const vacationRouter = createTRPCRouter({
  create: protectedProcedure
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

  delete: protectedProcedure
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

  updateAmountOfDays: protectedProcedure
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
