import { memo } from "react";
import clsx from "clsx";
import ParticipationCard from "../ParticipationCard/ParticipationCard";
import styles from "../Participation.module.css";

function ParticipationList({
  items,
  loading,
  errorMessage,
  emptyMessage,
  onItemAction,
  isActionLoading = false,
}) {
  if (loading) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.stateBox}>
          내 일정 정보를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={styles.listContainer}>
        <div className={clsx(styles.stateBox, styles.errorState)}>
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.stateBox}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {items.map((item) => (
        <ParticipationCard
          key={item.id}
          item={item}
          onAction={onItemAction}
          isActionLoading={isActionLoading}
        />
      ))}
    </div>
  );
}

export default memo(ParticipationList);
