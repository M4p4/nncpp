import { removeTokenCookie } from 'lib/cookies';
import { mAdmin } from 'lib/magic';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : '';
      await mAdmin.users.logoutByToken(didToken);
      removeTokenCookie(res);
      res.status(200).json({ success: true });
      res.writeHead(302, { Location: '/login' });
      res.end();
    } catch (err) {
      res.status(500).json({ success: false, message: err?.message });
    }
  }
};

export default handler;
