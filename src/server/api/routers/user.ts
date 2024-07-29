import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ userId: z.string()}))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.userId),
      });
  }),
});
