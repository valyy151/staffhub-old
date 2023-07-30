import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: userId, ctx }) => {
      return await ctx.prisma.user.delete({
        where: { id: userId },
      });
    }),
});
