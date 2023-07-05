import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const employeeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        address: z.string(),
        phoneNumber: z.string(),
      })
    )
    .mutation(async ({ input: { name, email, address, phoneNumber }, ctx }) => {
      return await ctx.prisma.employee.create({
        data: {
          name,
          email,
          address,
          phoneNumber,
          userId: ctx.session.user.id,
        },
      });
    }),

  getAllEmployees: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.employee.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  getUniqueEmployee: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      return await ctx.prisma.employee.findUnique({
        where: { id },
      });
    }),
});
