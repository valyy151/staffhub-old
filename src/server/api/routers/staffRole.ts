import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const staffRoleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), numberPerDay: z.number().optional() }))
    .mutation(async ({ input: { name, numberPerDay }, ctx }) => {
      return await ctx.prisma.staffRole.create({
        data: {
          name,
          numberPerDay,
          userId: ctx.session.user.id,
        },
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.staffRole.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        staffRoleId: z.string(),
        numberPerDay: z.number().optional(),
      })
    )
    .mutation(async ({ input: { staffRoleId, name, numberPerDay }, ctx }) => {
      return await ctx.prisma.staffRole.update({
        where: {
          id: staffRoleId,
        },
        data: {
          name,
          numberPerDay,
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

  assignToEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string(), staffRoleId: z.string() }))
    .mutation(async ({ input: { employeeId, staffRoleId }, ctx }) => {
      return await ctx.prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          roles: {
            connect: {
              id: staffRoleId,
            },
          },
        },
      });
    }),

  removeFromEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string(), staffRoleId: z.string() }))
    .mutation(async ({ input: { employeeId, staffRoleId }, ctx }) => {
      return await ctx.prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          roles: {
            disconnect: {
              id: staffRoleId,
            },
          },
        },
      });
    }),
});
