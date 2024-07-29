import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { bookCategoryEnum, books } from '@/server/db/schema';
import { and, asc, eq } from 'drizzle-orm';

export const bookRouter = createTRPCRouter({
  getAllShared: publicProcedure
    .input(z.object({ userId: z.string()}))
    .query(async ({ input, ctx }) => {
      return await ctx.db.select()
        .from(books)
        .where(eq(books.createdById, input.userId))
        .orderBy(asc(books.name));
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select()
      .from(books)
      .where(eq(books.createdById, ctx.session.user.id))
      .orderBy(asc(books.name));
  }),

  getBookById: protectedProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.query.books.findFirst({
      where: (book, { and, eq }) => and(eq(book.id, input.id), eq(book.createdById, ctx.session.user.id)),
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.enum(bookCategoryEnum.enumValues),
        numberOfVolumes: z.number().min(1),
        isCompleted: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(books).values({
        name: input.name,
        category: input.category,
        numberOfVolumes: input.numberOfVolumes,
        isCompleted: input.isCompleted,
        createdById: ctx.session.user.id,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        category: z.enum(bookCategoryEnum.enumValues),
        numberOfVolumes: z.number().min(1),
        isCompleted: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(books)
        .set({
          name: input.name,
          category: input.category,
          numberOfVolumes: input.numberOfVolumes,
          isCompleted: input.isCompleted,
        })
        .where(
          and(
            eq(books.id, input.id),
            eq(books.createdById, ctx.session.user.id),
          ),
        );
    }),
});
