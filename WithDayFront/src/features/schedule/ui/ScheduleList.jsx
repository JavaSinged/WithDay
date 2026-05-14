import ScheduleCard from "./ScheduleCard";
import styles from "./ScheduleList.module.css";

const renderScheduleCard = (schedule) => (
  <ScheduleCard key={schedule.id} schedule={schedule} />
);

export default function ScheduleList({ schedules = [] }) {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return (
      <div className={styles.emptyState}>
        <strong>조건에 맞는 일정이 아직 없어요.</strong>
        <p>카테고리를 바꾸거나 다른 검색어로 다시 찾아보세요.</p>
      </div>
    );
  }

  return <div className={styles.grid}>{schedules.map(renderScheduleCard)}</div>;
}
