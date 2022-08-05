import Navbar from 'components/nav/navbar';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from 'styles/Video.module.css';
import Head from 'next/head';
import cls from 'classnames';
import { getVideoById } from 'lib/youtube';
import ReactTimeAgo from 'react-time-ago';
import { useRouter } from 'next/router';
import DisLike from 'components/icons/dislike';
import Like from 'components/icons/like';

Modal.setAppElement('#modals');

const VideoPage = (props) => {
  const router = useRouter();
  const { id, title, publishTime, description, channelTitle, viewCount } =
    props.video;

  const [favourited, setFavourited] = useState(null);

  const updateState = async (fav) => {
    const res = await fetch('/api/stats', {
      method: 'POST',
      body: JSON.stringify({
        videoId: id,
        favourited: fav,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(await res.json());
  };

  const handleToggleLike = () => {
    if (favourited == 1) return;
    setFavourited(1);
    updateState(1);
  };

  const handleToggleDisLike = () => {
    if (favourited == 0) return;
    setFavourited(0);
    updateState(0);
  };

  useEffect(() => {
    const getVideoStats = async () => {
      const res = await fetch(`/api/stats?videoId=${id}`);
      const data = await res.json();
      if (data.success) {
        setFavourited(data.stats[0].favourited);
      }
    };
    getVideoStats();
  }, [id]);

  return (
    <>
      <Head>
        <title>Watch Video</title>
      </Head>
      <Navbar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.back()}
        contentLabel="Watch the video"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${id}?autoplay=0&controls=0&rel=1`}
          frameBorder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={favourited === 1} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDisLike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={favourited === 0} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>
                <ReactTimeAgo date={new Date(publishTime)} locale="en-US" />
              </p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Views: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const getStaticProps = async (ctx) => {
  const video = await getVideoById(ctx.params.id);

  // invalid video redirect to root
  if (video.error) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  return {
    props: {
      video,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const listOfVideos = ['FagJqquCwJ4', 'HcEaLDd2vOI'];

  const paths = listOfVideos.map((videoId) => {
    return { params: { id: videoId } };
  });
  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export default VideoPage;
