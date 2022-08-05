import { verifyToken } from 'lib/helper';

export const redirectUser = async (ctx) => {
  const token = ctx.req?.cookies?.token || null;
  const userId = verifyToken(token);

  return {
    userId,
    token,
  };
};
