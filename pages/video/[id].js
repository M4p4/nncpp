import { useRouter } from 'next/router';
import React from 'react';

const VideoPage = () => {
  const router = useRouter();
  const { id } = router;

  return <div>VideoPage</div>;
};

export default VideoPage;
