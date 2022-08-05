import React from 'react';
import Card from './card';
import styles from './section-card.module.css';
import cls from 'classnames';
import Link from 'next/link';

const SectionCards = (props) => {
  const {
    title,
    videos = [],
    size,
    shouldWrap = false,
    shouldScale = true,
  } = props;
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, index) => (
          <Link key={index} href={`/video/${video.id}`}>
            <a>
              <Card
                id={index}
                imgUrl={video.imgUrl}
                size={size}
                shouldScale={shouldScale}
              />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
