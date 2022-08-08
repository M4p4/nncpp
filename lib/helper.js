import * as jose from 'jose';
export const verifyToken = async (token) => {
  if (token) {
    var enc = new TextEncoder();
    const { payload } = await jose.jwtVerify(
      token,
      enc.encode(process.env.HASURA_JWT_SECRET_KEY)
    );
    return payload?.issuer;
  }
  return null;
};
