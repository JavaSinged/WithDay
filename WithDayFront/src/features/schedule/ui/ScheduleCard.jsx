import clsx from "clsx";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { dayjs } from "../../../shared/lib/dateUtile";
import styles from "./ScheduleCard.module.css";
import { useNavigate } from "react-router-dom";

const formatCardDate = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.isSame(end, "day")) {
    return start.format("M/DD (dd)");
  }

  return `${start.format("M/DD (dd)")} - ${end.format("M/DD (dd)")}`;
};

const STATUS_LABEL_MAP = {
  recruiting: "모집중",
  urgent: "마감임박",
  hot: "인기모임",
  closed: "모집마감",
};

export default function ScheduleCard({ schedule }) {
  const navigate = useNavigate();

  return (
    <article
      className={clsx(styles.card, {
        [styles.cardClosed]: schedule.status === "closed",
      })}
      onClick={() => navigate(`/schedule/${schedule.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`/schedule/${schedule.id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageWrap}>
        <img className={styles.image} src={schedule.imageUrl} alt={schedule.title} />
        <span
          className={clsx(styles.badge, {
            [styles.badgeUrgent]: schedule.status === "urgent",
            [styles.badgeHot]: schedule.status === "hot",
            [styles.badgeClosed]: schedule.status === "closed",
          })}
        >
          {STATUS_LABEL_MAP[schedule.status] ?? STATUS_LABEL_MAP.recruiting}
        </span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{schedule.title}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <CalendarMonthRoundedIcon fontSize="inherit" />
            {formatCardDate(schedule.startDate, schedule.endDate)}
          </span>
          <span className={styles.metaItem}>
            <PlaceRoundedIcon fontSize="inherit" />
            {schedule.location}
          </span>
        </div>

        <div className={styles.footer}>
          <span className={styles.participants}>
            <GroupsRoundedIcon fontSize="inherit" />
            {schedule.participants} / {schedule.maxParticipants}명
          </span>
        </div>
      </div>
    </article>
  );
}
