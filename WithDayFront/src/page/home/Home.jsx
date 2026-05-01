import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h2>추천 일정</h2>
        <div className={styles.cardList}>
          <div className={styles.card}>일정 카드</div>
          <div className={styles.card}>일정 카드</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>카테고리</h2>
        <div className={styles.categoryList}>
          <div>운동</div>
          <div>스터디</div>
          <div>취미</div>
        </div>
      </section>
    </main>
  );
}
