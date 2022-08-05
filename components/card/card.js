import Image from 'next/image';
import React, { useState } from 'react';
import styles from './card.module.css';
import { motion } from 'framer-motion';
import cls from 'classnames';

const Card = (props) => {
  const {
    imgUrl = '/static/default.jpg',
    size = 'medium',
    id,
    shouldScale = true,
  } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnImgError = () => {
    setImgSrc('/static/default.jpg');
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const hoverEffect = shouldScale && {
    ...scale,
    transition: { duration: 0.25 },
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imageMotionWrapper, classMap[size])}
        whileHover={hoverEffect}
      >
        <Image
          className={styles.cardImg}
          src={imgSrc}
          alt="image"
          layout="fill"
          onError={handleOnImgError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
