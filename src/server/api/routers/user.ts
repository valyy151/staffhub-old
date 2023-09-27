import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.delete({
      where: { id: ctx.session.user.id },
    });
  }),
});
