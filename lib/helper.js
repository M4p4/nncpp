import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.HASURA_JWT_SECRET_KEY);
    return decodedToken?.issuer;
  }
  return null;
};
