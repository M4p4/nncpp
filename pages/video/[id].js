import { useRouter } from 'next/router';
import React from 'react';

const VideoPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div>Video Page with id: {id}</div>;
};

export default VideoPage;
