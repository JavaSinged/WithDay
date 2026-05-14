import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import styles from "./Home.module.css";
import BannerSlider from "../../features/banner/ui/BannerSlider";
import CategoryFilter from "../../features/schedule/ui/CategoryFilter";
import ScheduleList from "../../features/schedule/ui/ScheduleList";
import { fetchSchedules } from "../../features/schedule/api";
import { dayjs } from "../../shared/lib/dateUtile";
import {
  HOME_BANNERS,
  HOME_CATEGORIES,
  HOME_SCHEDULES,
} from "./model/mockHomeData";

const DEFAULT_CATEGORY = "all";

const CATEGORY_LABEL_MAP = HOME_CATEGORIES.reduce((acc, category) => {
  acc[category.id] = category.label;
  return acc;
}, {});

const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

const getScheduleLocation = (schedule) => {
  if (typeof schedule.location === "string" && schedule.location.trim()) {
    return schedule.location.trim();
  }

  return [schedule.region, schedule.detailRegion]
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ");
};

const getScheduleStatus = (schedule, participants, maxParticipants) => {
  if (participants >= maxParticipants && maxParticipants > 0) {
    return "closed";
  }

  const recruitEndDate = schedule.recruitEndDate ?? schedule.startDate;
  const diffDays = dayjs(recruitEndDate).startOf("day").diff(dayjs().startOf("day"), "day");

  if (diffDays <= 1) {
    return "urgent";
  }

  if (participants / Math.max(maxParticipants, 1) >= 0.7) {
    return "hot";
  }

  return "recruiting";
};

const normalizeSchedule = (schedule, index) => {
  const participants = Number(
    schedule.participants ?? schedule.currentParticipants ?? schedule.approvedParticipants ?? 0,
  );
  const maxParticipants = Number(schedule.maxParticipants ?? schedule.capacity ?? 8);
  const location = getScheduleLocation(schedule);

  return {
    id: String(schedule.id ?? `mock-schedule-${index}`),
    title: schedule.title ?? "함께할 일정을 준비 중입니다",
    imageUrl:
      schedule.imageUrl ??
      schedule.thumbnailUrl ??
      schedule.images?.[0]?.imageUrl ??
      FALLBACK_IMAGE_URL,
    startDate: schedule.startDate ?? schedule.date ?? dayjs().add(index + 1, "day").toISOString(),
    endDate: schedule.endDate ?? schedule.startDate ?? schedule.date ?? dayjs().add(index + 1, "day").toISOString(),
    location: location || "장소 협의",
    participants,
    maxParticipants,
    status: getScheduleStatus(schedule, participants, maxParticipants),
    category: schedule.category ?? "etc",
  };
};

const matchKeyword = (schedule, keyword) => {
  if (!keyword) {
    return true;
  }

  const normalizedKeyword = keyword.toLowerCase();
  return (
    schedule.title.toLowerCase().includes(normalizedKeyword) ||
    schedule.location.toLowerCase().includes(normalizedKeyword)
  );
};

const filterSchedules = (schedules, activeCategory, keyword, region) =>
  schedules.filter((schedule) => {
    const matchesCategory =
      activeCategory === DEFAULT_CATEGORY || schedule.category === activeCategory;
    const matchesKeyword = matchKeyword(schedule, keyword);
    const matchesRegion = !region || schedule.location.includes(region);
    return matchesCategory && matchesKeyword && matchesRegion;
  });

const resolveHomeSchedules = async ({ activeCategory, keyword, region }) => {
  try {
    const apiSchedules = await fetchSchedules({
      category: activeCategory,
      keyword,
    });

    if (Array.isArray(apiSchedules) && apiSchedules.length > 0) {
      return filterSchedules(
        apiSchedules.map(normalizeSchedule),
        activeCategory,
        keyword,
        region,
      );
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[home] falling back to mock schedules", error);
    }
  }

  return filterSchedules(
    HOME_SCHEDULES.map(normalizeSchedule),
    activeCategory,
    keyword,
    region,
  );
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);

  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const selectedRegion = searchParams.get("region")?.trim() ?? "";

  const {
    data: schedules = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["home-schedules", activeCategory, keyword, selectedRegion],
    queryFn: () =>
      resolveHomeSchedules({
        activeCategory,
        keyword,
        region: selectedRegion,
      }),
  });

  const currentCategoryLabel = CATEGORY_LABEL_MAP[activeCategory] ?? "전체";

  return (
    <main className={styles.page}>
      <section className={styles.heroSection}>
        <BannerSlider items={HOME_BANNERS} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>카테고리</p>
            <h2 className={styles.sectionTitle}>취향에 맞는 모임을 골라보세요</h2>
          </div>
        </div>

        <CategoryFilter
          categories={HOME_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>지금 인기 있는 일정</p>
            <h2 className={styles.sectionTitle}>
              {keyword
                ? `"${keyword}" 검색 결과`
                : activeCategory === DEFAULT_CATEGORY
                  ? "지금 인기 있는 일정"
                  : `${currentCategoryLabel}에서 많이 보는 일정`}
            </h2>
            <p className={styles.sectionDescription}>
              {selectedRegion
                ? `${selectedRegion} 기준으로 함께하기 좋은 일정만 모았어요.`
                : "가볍게 합류할 수 있는 일정부터 마감 임박 일정까지 한 번에 볼 수 있어요."}
            </p>
          </div>
          <button type="button" className={styles.moreButton}>
            더보기
          </button>
        </div>

        {isPending && (
          <div className={styles.statePanel}>
            <div className={styles.spinner} />
            <p>메인 일정을 불러오는 중입니다.</p>
          </div>
        )}

        {isError && (
          <div className={styles.statePanel}>
            <p>일정 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        )}

        {!isPending && !isError && <ScheduleList schedules={schedules} />}
      </section>
    </main>
  );
}
