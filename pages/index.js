import Banner from 'components/banner/banner';
import SectionCards from 'components/card/section-cards';
import Navbar from 'components/nav/navbar';
import Head from 'next/head';
import styles from 'styles/Home.module.css';
import { getVideosByQuery, getPopularVideos } from 'lib/youtube';

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Neftlix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <Navbar />
        <Banner
          title="Warcraft - The Movie"
          subTitle="An epic movie in the warcraft universe"
          imgUrl="/static/banner.jpeg"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="Disney Videos"
            size="large"
            videos={props.disneyVideos}
          />
          <SectionCards
            title="Travel Videos"
            size="small"
            videos={props.travelVideos}
          />
          <SectionCards
            title="Productivity Videos"
            size="medium"
            videos={props.productivityVideos}
          />
          <SectionCards
            title="Popular Videos"
            size="small"
            videos={props.popularVideos}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const disneyVideos = await getVideosByQuery('Disney Trailer');
  const travelVideos = await getVideosByQuery('Travel');
  const productivityVideos = await getVideosByQuery('Productivity');
  const popularVideos = await getPopularVideos();
  console.log(disneyVideos);
  return {
    props: { disneyVideos, travelVideos, productivityVideos, popularVideos },
  };
};
