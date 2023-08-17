import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shiftModelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        start: z.number(),
      })
    )
    .mutation(async ({ input: { end, start }, ctx }) => {
      return await ctx.prisma.shiftModel.create({
        data: {
          end,
          start,
          userId: ctx.session.user.id,
        },
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.shiftModel.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        end: z.number(),
        start: z.number(),
      })
    )
    .mutation(async ({ input: { id, end, start }, ctx }) => {
      return await ctx.prisma.shiftModel.update({
        where: {
          id,
        },
        data: {
          end,
          start,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id }, ctx }) => {
      return await ctx.prisma.shiftModel.delete({
        where: {
          id,
        },
      });
    }),
});
