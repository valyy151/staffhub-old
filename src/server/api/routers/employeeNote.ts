import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const employeeNoteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ employeeId: z.string(), content: z.string() }))
    .mutation(async ({ input: { employeeId, content }, ctx }) => {
      return await ctx.prisma.employeeNote.create({
        data: {
          content,
          employeeId,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ noteId: z.string(), content: z.string() }))
    .mutation(async ({ input: { noteId, content }, ctx }) => {
      return await ctx.prisma.employeeNote.update({
        where: { id: noteId, userId: ctx.session.user.id },
        data: { content },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(async ({ input: { noteId }, ctx }) => {
      return await ctx.prisma.employeeNote.delete({
        where: { id: noteId, userId: ctx.session.user.id },
      });
    }),
});
