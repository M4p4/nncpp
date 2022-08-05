import { VideoIdForUserExists, addState, updateState } from 'lib/db/hasura';
import { verifyToken } from 'lib/helper';

const handler = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(403).json({ success: false });
      return;
    }

    const { videoId } = req.method === 'POST' ? req.body : req.query;

    if (videoId) {
      const userId = verifyToken(token);
      const videoState = await VideoIdForUserExists(token, userId, videoId);
      if (req.method === 'POST') {
        const { favourited, watched = true } = req.body;
        if (videoState.length > 0) {
          const statsRes = await updateState(token, {
            favourited,
            watched,
            videoId,
            userId,
          });
          res.status(200).json({ success: true, stats: statsRes });
          return;
        } else {
          const statsRes = await addState(token, {
            favourited,
            watched,
            videoId,
            userId,
          });
          res.status(200).json({ success: true, stats: statsRes });
          return;
        }
      } else {
        if (videoState.length > 0) {
          res.status(200).json({ success: true, stats: videoState });
        } else {
          res.status(200).json({ success: false });
        }
        return;
      }
    }
    res.status(403).json({ success: false });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message });
  }
};

export default handler;
