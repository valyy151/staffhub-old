import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const schedulePreferenceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        hoursPerMonth: z.number(),
        shiftModelIds: z.array(z.string()),
      })
    )
    .mutation(
      async ({ input: { employeeId, hoursPerMonth, shiftModelIds }, ctx }) => {
        return await ctx.prisma.schedulePreference.create({
          data: {
            employeeId,
            hoursPerMonth,
            userId: ctx.session.user.id,
            shiftModels: {
              connect: shiftModelIds.map((id) => ({ id })),
            },
          },
        });
      }
    ),

  update: protectedProcedure
    .input(
      z.object({
        schedulePreferenceId: z.string(),
        hoursPerMonth: z.number(),
        shiftModelIds: z.array(z.string()),
      })
    )
    .mutation(
      async ({
        input: { schedulePreferenceId, hoursPerMonth, shiftModelIds },
        ctx,
      }) => {
        return await ctx.prisma.schedulePreference.update({
          where: { id: schedulePreferenceId },
          data: {
            hoursPerMonth,
            shiftModels: {
              connect: shiftModelIds.map((id) => ({ id })),
            },
          },
        });
      }
    ),

  delete: protectedProcedure
    .input(z.object({ schedulePreferenceId: z.string() }))
    .mutation(async ({ input: { schedulePreferenceId }, ctx }) => {
      return await ctx.prisma.schedulePreference.delete({
        where: { id: schedulePreferenceId },
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.schedulePreference.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        hoursPerMonth: true,
        shiftModels: true,
      },
    });
  }),
});
