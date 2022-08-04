import { mAdmin } from 'lib/magic';
import jwt from 'jsonwebtoken';
import { createUser, userExists } from 'lib/db/hasura';
import { setTokenCookie } from 'lib/cookies';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : '';
      //invoke magic
      const metadata = await mAdmin.users.getMetadataByToken(didToken);
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          // 7 days
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user', 'admin'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': `${metadata.issuer}`,
          },
        },
        process.env.HASURA_JWT_SECRET_KEY,
        {
          algorithm: 'HS256',
        }
      );

      const userIsThere = await userExists(token, metadata.issuer);

      if (!userIsThere) {
        const user = await createUser(token, metadata);
      }
      setTokenCookie(token, res);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: err?.message });
    }
  }
};

export default handler;
