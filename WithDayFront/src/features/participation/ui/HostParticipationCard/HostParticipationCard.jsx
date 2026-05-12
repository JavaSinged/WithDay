import clsx from "clsx";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { PARTICIPATION_STATUS_META } from "../../model/constants";
import ParticipationStatusActions from "../ParticipationStatusActions/ParticipationStatusActions";
import styles from "../Participation.module.css";
import hostStyles from "../HostParticipationList/HostParticipationList.module.css";

function HostParticipationCard({ item, hostEmail, onAction, isActionLoading }) {
  const meta = PARTICIPATION_STATUS_META[item.status] ?? PARTICIPATION_STATUS_META.default;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.tags}>
          <span className={styles.categoryBadge}>신청자</span>
          <span className={clsx(styles.statusBadge, styles[meta.badgeClass])}>
            {meta.badgeText}
          </span>
        </div>

        <span className={styles.location}>
          <PersonOutlineOutlinedIcon fontSize="small" className={styles.inlineIcon} />
          {item.nickname}
        </span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.nickname}</h3>
        <div className={styles.cardDate}>
          <EmailOutlinedIcon fontSize="small" className={styles.inlineIcon} />
          {item.email}
        </div>
        <div className={hostStyles.meta}>
          <AccessTimeOutlinedIcon fontSize="small" className={styles.inlineIcon} />
          신청일 {item.createdAt || "-"}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.cardFooter}>
        <div className={hostStyles.actionNote}>
          <AccessTimeOutlinedIcon fontSize="small" className={styles.inlineIcon} />
          상태 변경은 호스트만 가능합니다.
        </div>

        <ParticipationStatusActions
          participationId={item.participationId}
          scheduleId={item.scheduleId}
          email={hostEmail}
          status={item.status}
          disabled={isActionLoading}
          onAction={onAction}
        />
      </div>
    </div>
  );
}

export default HostParticipationCard;
