import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const employeeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        role: z.string().optional(),
        address: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(
      async ({ input: { name, role, email, address, phoneNumber }, ctx }) => {
        return await ctx.prisma.employee.create({
          data: {
            name,
            email,
            address: address || "",
            userId: ctx.session.user.id,
            phoneNumber: phoneNumber || "",
            roles: { connect: { id: role } },
          },
        });
      }
    ),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        address: z.string(),
        employeeId: z.string(),
        phoneNumber: z.string(),
      })
    )
    .mutation(
      async ({
        input: { employeeId, name, email, address, phoneNumber },
        ctx,
      }) => {
        return await ctx.prisma.employee.update({
          where: { id: employeeId },
          data: { name, email, address, phoneNumber },
        });
      }
    ),

  delete: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .mutation(async ({ input: { employeeId }, ctx }) => {
      return await ctx.prisma.employee.delete({
        where: { id: employeeId },
      });
    }),

  find: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.employee.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        roles: true,
        email: true,
        address: true,
        vacations: true,
        sickLeaves: true,
        phoneNumber: true,
        schedulePreference: {
          select: {
            id: true,
            createdAt: true,
            hoursPerMonth: true,
            shiftModels: {
              select: {
                id: true,
                end: true,
                start: true,
              },
            },
          },
        },
      },
    });
  }),

  findOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        endOfMonth: z.number().optional(),
        startOfMonth: z.number().optional(),
        fetchAllRoles: z.boolean().optional(),
        fetchShiftModels: z.boolean().optional(),
      })
    )
    .query(
      async ({
        input: {
          id,
          endOfMonth,
          startOfMonth,
          fetchAllRoles,
          fetchShiftModels,
        },
        ctx,
      }) => {
        const employeePromise = ctx.prisma.employee.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
            notes: {
              select: {
                id: true,
                content: true,
                createdAt: true,
              },
            },
            address: true,
            vacations: {
              select: {
                id: true,
                start: true,
                end: true,
              },
            },
            sickLeaves: {
              select: {
                id: true,
                start: true,
                end: true,
              },
            },
            phoneNumber: true,
            vacationDays: true,
            schedulePreference: {
              select: {
                id: true,
                hoursPerMonth: true,
                shiftModels: {
                  select: {
                    id: true,
                    end: true,
                    start: true,
                  },
                },
              },
            },
          },
        });

        let shiftsPromise;

        let allRolesPromise;

        let workDaysPromise;

        let allShiftModelsPromise;

        if (endOfMonth && startOfMonth) {
          shiftsPromise = ctx.prisma.shift.findMany({
            where: {
              employeeId: id,
              date: { lte: endOfMonth, gte: startOfMonth },
            },
          });

          workDaysPromise = ctx.prisma.workDay.findMany({
            where: {
              date: { lte: endOfMonth, gte: startOfMonth },
            },
          });
        } else {
          shiftsPromise = Promise.resolve([]);
          workDaysPromise = Promise.resolve([]);
        }

        if (fetchAllRoles) {
          allRolesPromise = ctx.prisma.staffRole.findMany({
            where: { userId: ctx.session.user.id },
            select: { id: true, name: true },
          });
        } else {
          allRolesPromise = Promise.resolve([]);
        }

        if (fetchShiftModels) {
          allShiftModelsPromise = ctx.prisma.shiftModel.findMany({
            where: { userId: ctx.session.user.id },
            select: {
              id: true,
              start: true,
              end: true,
            },
          });
        } else {
          allShiftModelsPromise = Promise.resolve([]);
        }

        const [shifts, employee, workDays, allRoles, allShiftModels] =
          await Promise.all([
            shiftsPromise,
            employeePromise,
            workDaysPromise,
            allRolesPromise,
            allShiftModelsPromise,
          ]);

        if (endOfMonth && startOfMonth) {
          const newWorkDays = workDays.map((workDay) => {
            const dayShifts = shifts.filter(
              (shift) => shift.date === workDay.date
            );
            return {
              ...workDay,
              vacation: false,
              sickLeave: false,
              shifts: dayShifts,
            };
          });

          return {
            ...employee,
            allRoles: [],
            shiftModels: [],
            workDays: newWorkDays,
          };
        }

        if (fetchAllRoles) {
          return {
            ...employee,
            allRoles,
            workDays: [],
            shiftModels: [],
          };
        }

        if (fetchShiftModels) {
          return {
            ...employee,
            allRoles: [],
            workDays: [],
            shiftModels: allShiftModels,
          };
        }

        return {
          ...employee,
          allRoles: [],
          workDays: [],
          shiftModels: [],
        };
      }
    ),
});
