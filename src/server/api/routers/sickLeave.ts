import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const sickLeaveRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        start: z.number(),
        employeeId: z.string(),
      })
    )
    .mutation(async ({ input: { start, end, employeeId }, ctx }) => {
      return await ctx.prisma.sickLeave.create({
        data: {
          end,
          start,
          employeeId,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: sickLeaveId, ctx }) => {
      return await ctx.prisma.sickLeave.delete({
        where: { id: sickLeaveId },
      });
    }),
});
