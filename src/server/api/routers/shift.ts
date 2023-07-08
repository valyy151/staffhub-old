import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const shiftRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        date: z.number(),
        start: z.number(),
        employeeId: z.string(),
      })
    )
    .mutation(async ({ input: { start, end, date, employeeId }, ctx }) => {
      const modifiedDate = new Date(date * 1000);

      modifiedDate.setHours(0, 0, 0, 0);
      const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);

      return await ctx.prisma.shift.create({
        data: {
          end,
          start,
          employeeId,
          date: midnightUnixCode,
          userId: ctx.session.user.id,
        },
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.shift.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        shiftId: z.string(),
        shift: z.object({
          end: z.number(),
          start: z.number(),
        }),
      })
    )
    .mutation(async ({ input: { shift, shiftId }, ctx }) => {
      return await ctx.prisma.shift.update({
        where: { id: shiftId },
        data: { userId: ctx.session.user.id, ...shift },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        shiftId: z.string(),
      })
    )
    .mutation(async ({ input: { shiftId }, ctx }) => {
      return await ctx.prisma.shift.delete({
        where: { id: shiftId },
      });
    }),
});
