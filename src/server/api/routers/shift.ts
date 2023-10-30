import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const shiftRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        end: z.number(),
        date: z.number(),
        start: z.number(),
        employeeId: z.string(),
        roleId: z.string().optional(),
      })
    )
    .mutation(
      async ({ input: { end, date, roleId, start, employeeId }, ctx }) => {
        const modifiedDate = new Date(date * 1000);

        modifiedDate.setHours(0, 0, 0, 0);
        const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);

        return await ctx.prisma.shift.create({
          data: {
            end,
            start,
            employeeId,
            roleId: roleId || "",
            date: midnightUnixCode,
            userId: ctx.session.user.id,
          },
        });
      }
    ),

  createMany: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        schedule: z.array(
          z.object({
            end: z.number(),
            date: z.number(),
            start: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input: { schedule, employeeId }, ctx }) => {
      return await ctx.prisma.shift.createMany({
        data: schedule.map((shift) => {
          const modifiedDate = new Date(shift.date * 1000);

          modifiedDate.setHours(0, 0, 0, 0);

          const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);

          return {
            employeeId,
            end: shift.end,
            start: shift.start,
            date: midnightUnixCode,
            userId: ctx.session.user.id,
          };
        }),
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.shift.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { start: "asc" },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        shiftId: z.string(),
        shift: z.object({
          end: z.number(),
          start: z.number(),
          roleId: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input: { shift, shiftId }, ctx }) => {
      return await ctx.prisma.shift.update({
        where: { id: shiftId, userId: ctx.session.user.id },
        data: { ...shift },
      });
    }),

  createOrUpdateAbsence: protectedProcedure
    .input(
      z.object({
        reason: z.string(),
        absent: z.boolean(),
        shiftId: z.string(),
        approved: z.boolean(),
      })
    )
    .mutation(async ({ input: { reason, approved, absent, shiftId }, ctx }) => {
      const absence = await ctx.prisma.absence.findUnique({
        where: { shiftId: shiftId, userId: ctx.session.user.id },
      });

      if (!absence) {
        return await ctx.prisma.absence.create({
          data: {
            absent,
            reason,
            shiftId,
            userId: ctx.session.user.id,
          },
        });
      }
      return await ctx.prisma.shift.update({
        where: { id: shiftId, userId: ctx.session.user.id },
        data: {
          absence: {
            update: {
              absent,
              reason,
              approved,
            },
          },
        },
      });
    }),

  updateAbsences: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          approved: z.boolean(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      input.map(async (absence) => {
        await Promise.all([
          ctx.prisma.absence.update({
            where: { shiftId: absence.id },
            data: { approved: absence.approved },
          }),
        ]);
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
        where: { id: shiftId, userId: ctx.session.user.id },
      });
    }),
});
