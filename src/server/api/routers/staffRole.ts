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
      orderBy: {
        name: "asc",
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
          userId: ctx.session.user.id,
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
        where: { id, userId: ctx.session.user.id },
      });
    }),

  assignToEmployee: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        roleIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input: { employeeId, roleIds }, ctx }) => {
      return await ctx.prisma.employee.update({
        where: {
          id: employeeId,
          userId: ctx.session.user.id,
        },
        data: {
          roles: {
            set: roleIds.map((id) => ({ id })),
          },
        },
      });
    }),
});
