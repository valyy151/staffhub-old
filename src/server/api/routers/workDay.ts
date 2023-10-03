import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const workDayRouter = createTRPCRouter({
  yearExists: protectedProcedure
    .input(z.object({ date: z.number() }))
    .query(async ({ input: { date }, ctx }) => {
      const exists = await ctx.prisma.workDay.findUnique({
        where: { date },
      });

      if (!exists) {
        return false;
      }

      return true;
    }),

  createMany: protectedProcedure
    .input(z.array(z.object({ date: z.number() })))
    .mutation(async ({ input: yearArray, ctx }) => {
      return await ctx.prisma.workDay.createMany({
        data: yearArray.map((day) => {
          const modifiedDate = new Date(day.date * 1000);

          modifiedDate.setHours(0, 0, 0, 0);

          const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000);
          return {
            date: midnightUnixCode,
          };
        }),
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.workDay.findMany();
  }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const workDayPromise = ctx.prisma.workDay.findUnique({
        where: { id },
      });

      const shiftsPromise = workDayPromise.then((workDay) => {
        return ctx.prisma.shift.findMany({
          where: { date: workDay?.date, userId: ctx.session.user.id },
          include: {
            employee: {
              select: {
                name: true,
                roles: {
                  select: { id: true, name: true },
                },
                schedulePreference: {
                  select: {
                    shiftModels: { select: { start: true, end: true } },
                  },
                },
              },
            },
            role: {
              select: { id: true, name: true },
            },
            absence: true,
          },
        });
      });

      const notesPromise = ctx.prisma.workDayNote.findMany({
        where: { workDayId: id, userId: ctx.session.user.id },
      });

      const rolesPromise = ctx.prisma.staffRole.findMany({
        where: { userId: ctx.session.user.id },
        select: { id: true, name: true, numberPerDay: true },
      });

      const shiftModelsPromise = ctx.prisma.shiftModel.findMany({
        where: { userId: ctx.session.user.id },
        select: {
          end: true,
          start: true,
        },
      });

      const [notes, roles, shifts, workDay, shiftModels] = await Promise.all([
        notesPromise,
        rolesPromise,
        shiftsPromise,
        workDayPromise,
        shiftModelsPromise,
      ]);

      return { ...workDay, roles, notes, shifts, shiftModels };
    }),
});
