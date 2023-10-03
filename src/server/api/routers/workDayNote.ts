import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const workDayNoteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ workDayId: z.string(), content: z.string() }))
    .mutation(async ({ input: { workDayId, content }, ctx }) => {
      return await ctx.prisma.workDayNote.create({
        data: {
          content,
          workDayId,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(async ({ input: { noteId }, ctx }) => {
      return await ctx.prisma.workDayNote.delete({
        where: { id: noteId, userId: ctx.session.user.id },
      });
    }),
});
