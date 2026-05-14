import { memo } from "react";
import EmptyState from "./EmptyState";
import ScheduleCard from "./ScheduleCard";
import styles from "./Participation.module.css";

const renderScheduleCard =
  ({ onItemAction, isActionLoading }) =>
  (item) =>
    (
      <ScheduleCard
        key={item.id}
        item={item}
        onAction={onItemAction}
        isActionLoading={isActionLoading}
      />
    );

function ScheduleList({
  items,
  loading,
  errorMessage,
  emptyMessage,
  onItemAction,
  isActionLoading = false,
}) {
  if (loading) {
    return <EmptyState message="내 일정 정보를 불러오는 중입니다." />;
  }

  if (errorMessage) {
    return <EmptyState message={errorMessage} variant="error" />;
  }

  if (!items || items.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={styles.listContainer}>
      {items.map(
        renderScheduleCard({
          onItemAction,
          isActionLoading,
        })
      )}
    </div>
  );
}

export default memo(ScheduleList);
