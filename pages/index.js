import Banner from 'components/banner/banner';
import SectionCards from 'components/card/section-cards';
import Navbar from 'components/nav/navbar';
import Head from 'next/head';
import styles from 'styles/Home.module.css';
import { getVideosByQuery, getPopularVideos } from 'lib/youtube';
import { getWatchItAgainVideos } from 'lib/videos-helper';
import { redirectUser } from 'utils/redirectUser';

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Neftlix</title>
      </Head>
      <div className={styles.main}>
        <Navbar />
        <Banner
          title="Warcraft - The Movie"
          subTitle="An epic movie in the warcraft universe"
          imgUrl="/static/banner.jpeg"
          videoId="FagJqquCwJ4"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="Disney Videos"
            size="large"
            videos={disneyVideos}
          />
          {watchItAgainVideos.length > 0 && (
            <SectionCards
              title="Watch It Again Videos"
              size="small"
              videos={watchItAgainVideos}
            />
          )}
          <SectionCards
            title="Travel Videos"
            size="small"
            videos={travelVideos}
          />
          <SectionCards
            title="Productivity Videos"
            size="medium"
            videos={productivityVideos}
          />
          <SectionCards
            title="Popular Videos"
            size="small"
            videos={popularVideos}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const { token, userId } = await redirectUser(ctx);

  const disneyVideos = await getVideosByQuery('Disney Trailer');
  const travelVideos = []; //await getVideosByQuery('Travel');
  const productivityVideos = []; //await getVideosByQuery('Productivity');
  const popularVideos = []; //await getPopularVideos();
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
};
