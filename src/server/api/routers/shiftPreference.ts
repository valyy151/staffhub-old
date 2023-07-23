import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shiftPreferenceRouter = createTRPCRouter({
  create: protectedProcedure
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

  update: protectedProcedure
    .input(z.object({ shiftPreferenceId: z.string(), content: z.string() }))
    .mutation(async ({ input: { shiftPreferenceId, content }, ctx }) => {
      return await ctx.prisma.shiftPreference.update({
        where: { id: shiftPreferenceId },
        data: { content },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ shiftPreferenceId: z.string() }))
    .mutation(async ({ input: { shiftPreferenceId }, ctx }) => {
      return await ctx.prisma.shiftPreference.delete({
        where: { id: shiftPreferenceId },
      });
    }),
});
