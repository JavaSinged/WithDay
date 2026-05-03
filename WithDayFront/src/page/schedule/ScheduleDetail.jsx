import React, { useState } from "react";
import Button from "../../shared/ui/Button/Button";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import PaymentsIcon from "@mui/icons-material/Payments";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "./ScheduleDetail.module.css";

// Lightbox 라이브러리 (이미지 원본 크기 보기 및 줌 기능)
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function ScheduleDetail({ schedule }) {
  const data = schedule || {
    title: "제주도 3박 4일 렌트카 쉐어 동행 구해요!",
    category: "여행",
    region: "제주특별자치도",
    images: [
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    ],
    description:
      "혼자 가기엔 렌트비가 부담스러워서 같이 다니실 분 찾아요. 맛집 탐방 위주입니다!",
    start_date: "2023.11.15",
    end_date: "2023.11.18",
    recruit_end_date: "2023.11.10",
    max_participants: 4,
    current_participants: 2,
    gender_limit: "성별 무관",
    age_min: 20,
    age_max: 35,
    total_price: 150000,
    cost_type: "각출",
    status: "recruiting",
    view_count: 124,
  };

  const [currentImg, setCurrentImg] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false); // Lightbox 상태

  const nextSlide = () =>
    setCurrentImg((prev) => (prev === data.images.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentImg((prev) => (prev === 0 ? data.images.length - 1 : prev - 1));

  const handleApply = () => {
    const confirmJoin = window.confirm("이 일정에 참여 신청을 하시겠습니까?");
    if (confirmJoin) {
      alert("신청이 완료되었습니다! 주최자의 승인을 기다려주세요.");
    }
  };

  // Lightbox용 이미지 배열 변환
  const lightboxSlides = data.images.map((imgUrl) => ({ src: imgUrl }));

  return (
    <div className={styles.container}>
      {/* 1. 이미지 슬라이더 영역 */}
      <section className={styles.imageSection}>
        <div className={styles.slider}>
          <img
            src={data.images[currentImg]}
            alt="일정 이미지"
            className={styles.mainImage}
            onClick={() => setIsViewerOpen(true)}
            style={{ cursor: "pointer" }}
          />
          {data.images.length > 1 && (
            <>
              <button className={styles.prevBtn} onClick={prevSlide}>
                <ChevronLeftIcon />
              </button>
              <button className={styles.nextBtn} onClick={nextSlide}>
                <ChevronRightIcon />
              </button>
              <div className={styles.indicator}>
                {currentImg + 1} / {data.images.length}
              </div>
            </>
          )}
        </div>
      </section>

      <div className={styles.contentWrapper}>
        {/* 2. 제목 및 요약 정보 */}
        <section className={styles.headerSection}>
          <div className={styles.badgeWrapper}>
            <span className={styles.categoryBadge}>{data.category}</span>
            <span
              className={
                data.status === "recruiting"
                  ? styles.statusOpen
                  : styles.statusClosed
              }
            >
              {data.status === "recruiting" ? "모집중" : "모집종료"}
            </span>
          </div>
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.metaInfo}>
            <span>
              <VisibilityIcon fontSize="small" /> {data.view_count}
            </span>
            <span>
              <PlaceIcon fontSize="small" /> {data.region}
            </span>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 3. 상세 조건 */}
        <section className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <CalendarTodayIcon className={styles.icon} />
            <div>
              <p className={styles.label}>일정 기간</p>
              <p className={styles.value}>
                {data.start_date} ~ {data.end_date}
              </p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <PeopleIcon className={styles.icon} />
            <div>
              <p className={styles.label}>모집 인원 / 조건</p>
              <p className={styles.value}>
                {data.current_participants} / {data.max_participants}명 (최소{" "}
                {data.current_participants}명)
              </p>
              <p className={styles.subValue}>
                {data.gender_limit} | {data.age_min}세 ~ {data.age_max}세
              </p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <PaymentsIcon className={styles.icon} />
            <div>
              <p className={styles.label}>예상 비용</p>
              <p className={styles.value}>
                총 {data.total_price.toLocaleString()}원
              </p>
              <p className={styles.subValue}>정산 방식: {data.cost_type}</p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 4. 본문 상세 설명 */}
        <section className={styles.descriptionSection}>
          <h2 className={styles.subTitle}>상세 설명</h2>
          <p className={styles.descriptionText}>{data.description}</p>
        </section>
      </div>

      {/* 5. 하단 고정 신청 바 (sticky) */}
      <footer className={styles.stickyFooter}>
        <div className={styles.footerInfo}>
          <span className={styles.recruitDeadline}>
            마감일: {data.recruit_end_date}
          </span>
        </div>
        <Button
          variant={data.status === "recruiting" ? "accent" : "outline"}
          size="md"
          disabled={data.status !== "recruiting"}
          onClick={handleApply}
        >
          {data.status === "recruiting" ? "참여 신청하기" : "모집 종료"}
        </Button>
      </footer>

      {/* 6. Lightbox (이미지 원본 보기 및 줌) */}
      <Lightbox
        open={isViewerOpen}
        close={() => setIsViewerOpen(false)}
        index={currentImg}
        slides={lightboxSlides}
        plugins={[Zoom]}
        on={{
          view: ({ index }) => setCurrentImg(index),
        }}
      />
    </div>
  );
}
