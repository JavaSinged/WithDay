import styles from "./Header.module.css";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>서울 ▼</div>

      <div className={styles.right}>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
      </div>
    </header>
  );
}
