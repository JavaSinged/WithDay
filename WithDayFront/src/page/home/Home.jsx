import React, { useState } from "react";
import Button from "../../shared/ui/Button/Button";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import styles from "./Home.module.css";

export default function Home() {
  // 현재 선택된 카테고리 상태 관리
  const [activeCategory, setActiveCategory] = useState("전체");

  // 임시 카테고리 데이터
  const categories = ["전체", "여행", "팝업", "식사", "액티비티"];

  // 임시 일정 데이터 (Mock Data)
  const mockSchedules = [
    {
      id: 1,
      category: "여행",
      title: "제주도 3박 4일 렌트카 쉐어 동행 구해요!",
      region: "제주특별자치도",
      date: "2023.11.15 - 11.18",
      currentParticipants: 2,
      maxParticipants: 4,
    },
    {
      id: 2,
      category: "팝업",
      title: "성수동 인기 디저트 팝업 같이 웨이팅하실 분",
      region: "서울 성동구",
      date: "2023.10.28",
      currentParticipants: 1,
      maxParticipants: 2,
    },
    {
      id: 3,
      category: "식사",
      title: "강남역 오마카세 예약 1자리 남아서 양도/동행해요",
      region: "서울 강남구",
      date: "2023.10.30",
      currentParticipants: 1,
      maxParticipants: 2,
    },
  ];

  return (
    <main className={styles.main}>
      {/* 히어로/배너 영역 */}
      <section className={styles.banner}>
        <h2 className={styles.bannerTitle}>
          혼자 가기 애매할 때,
          <br />
          <span className={styles.highlight}>함께할 동행</span>을 찾아보세요
        </h2>
      </section>

      {/* 카테고리 필터 영역 */}
      <section className={styles.section}>
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "accent" : "outline"}
              size="md"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* 추천/최신 일정 리스트 영역 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>방금 올라온 일정</h2>
          <Button variant="outline" size="md">
            더보기
          </Button>
        </div>

        <div className={styles.cardList}>
          {mockSchedules.map((schedule) => (
            <div key={schedule.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>{schedule.category}</span>
                <span
                  className={styles.region}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <PlaceIcon
                    fontSize="small"
                    style={{
                      marginRight: "4px",
                      color: "var(--color-text-muted)",
                    }}
                  />
                  {schedule.region}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{schedule.title}</h3>

              <div className={styles.cardInfo}>
                <span
                  className={styles.date}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <CalendarTodayIcon
                    fontSize="small"
                    style={{
                      marginRight: "4px",
                      color: "var(--color-text-muted)",
                    }}
                  />
                  {schedule.date}
                </span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.participants}>
                  모집 인원
                  <strong> {schedule.currentParticipants} </strong>/{" "}
                  {schedule.maxParticipants}
                </div>
                <Button variant="accent" size="md">
                  신청하기
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
