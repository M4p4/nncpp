import SectionCards from 'components/card/section-cards';
import Navbar from 'components/nav/navbar';
import { getFavVideos } from 'lib/videos-helper';
import Head from 'next/head';
import React from 'react';
import styles from 'styles/MyList.module.css';
import { redirectUser } from 'utils/redirectUser';

const MyListPage = ({ videos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            size="small"
            videos={videos}
            shouldWrap={true}
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const { token, userId } = await redirectUser(ctx);

  if (!userId) {
    return {
      redirect: {
        destination: '/login',
        permament: false,
      },
    };
  }

  const videos = await getFavVideos(userId, token);
  return {
    props: {
      videos,
    },
  };
};

export default MyListPage;
