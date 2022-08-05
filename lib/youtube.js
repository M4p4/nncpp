const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const getPopularVideos = async (limit = 25) => {
  return await getVideos(
    `videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=${limit}`
  );
};

export const getVideosByQuery = async (query, limit = 25) => {
  return await getVideos(
    `search?part=snippet&type=video&maxResults=${limit}&q=${new URLSearchParams(
      query
    )}`
  );
};

export const getVideoById = async (id) => {
  const video = await getVideos(
    `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}`
  );
  if (video.length > 0) {
    return { ...video[0], error: false };
  }
  return { error: true };
};

const getVideos = async (apiPath) => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/${apiPath}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.error('Youtube API Error', data.error);
      return [];
    }

    return data.items.map((item) => {
      const id = item.id?.videoId || item.id;
      return {
        id,
        title: item.snippet?.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        description: item.snippet?.description,
        viewCount: item.statistics?.viewCount || 0,
        channelTitle: item.snippet?.channelTitle,
        publishTime: item.snippet?.publishedAt,
      };
    });
  } catch (err) {
    console.error(err.message || 'something went wrong while getting yt data.');
    return [];
  }
};
