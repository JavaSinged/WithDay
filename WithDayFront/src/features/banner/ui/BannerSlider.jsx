import { useEffect, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import clsx from "clsx";
import styles from "./BannerSlider.module.css";

const AUTO_SLIDE_INTERVAL = 4500;

export default function BannerSlider({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <section className={clsx(styles.slider, styles[currentItem.accent])}>
      <img
        className={styles.image}
        src={currentItem.imageUrl}
        alt={currentItem.title.replaceAll("\n", " ")}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.kicker}>함께 만드는 오늘의 동행</p>
        <h1 className={styles.title}>
          {currentItem.title.split("\n").map((line) => (
            <span key={`${currentItem.id}-${line}`} className={styles.titleLine}>
              {line}
            </span>
          ))}
        </h1>
        <p className={styles.description}>
          {currentItem.description.split("\n").map((line) => (
            <span key={`${currentItem.id}-${line}-description`} className={styles.descriptionLine}>
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className={styles.controls}>
        <span className={styles.pagination}>
          {currentIndex + 1} / {items.length}
        </span>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={handlePrev}
            aria-label="이전 배너"
          >
            <ChevronLeftRoundedIcon />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={handleNext}
            aria-label="다음 배너"
          >
            <ChevronRightRoundedIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
