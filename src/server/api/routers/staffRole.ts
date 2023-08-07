import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const staffRoleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), numberPerDay: z.number().optional() }))
    .mutation(async ({ input: { name }, ctx }) => {
      return await ctx.prisma.staffRole.create({
        data: {
          name,
          numberPerDay: 0,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      return await ctx.prisma.staffRole.delete({
        where: {
          id,
        },
      });
    }),
});
