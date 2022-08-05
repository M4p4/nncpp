import { getFavouritedVideos, getWatchedVideos } from './db/hasura';

export const getWatchItAgainVideos = async (issuer, token) => {
  const videos = await getWatchedVideos(issuer, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
};

export const getFavVideos = async (issuer, token) => {
  const videos = await getFavouritedVideos(issuer, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
};
