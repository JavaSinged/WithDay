import { memo } from "react";
import clsx from "clsx";
import Button from "../../../../shared/ui/Button/Button";
import styles from "../Participation.module.css";

function ParticipationTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles.tabWrap}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant="outline"
          size="md"
          className={clsx(styles.tabBtn, {
            [styles.active]: activeTab === tab.value,
          })}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

export default memo(ParticipationTabs);
