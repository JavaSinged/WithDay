import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BottomNav.module.css";
import { getAuthUser } from "../auth/lib/getAuthUser";

const NAV_ITEMS = [
  { id: "home", label: "홈", path: "/", icon: HomeRoundedIcon, match: "home" },
  { id: "search", label: "탐색", path: "/", icon: SearchRoundedIcon, match: "search" },
  { id: "write", label: "활동 추가", path: "/write", icon: AddRoundedIcon, isCenter: true },
  { id: "calendar", label: "내 일정", path: "/my-schedule", icon: CalendarMonthRoundedIcon },
  { id: "profile", label: "마이", path: "/login", icon: PersonOutlineRoundedIcon, match: "profile" },
];

const resolveActiveState = (pathname, item) => {
  if (item.match === "home") {
    return pathname === "/";
  }

  if (item.match === "search") {
    return false;
  }

  if (item.match === "profile") {
    return pathname === "/login" || pathname === "/signup" || pathname === "/signup/extra";
  }

  return pathname.startsWith(item.path);
};

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = getAuthUser();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = resolveActiveState(location.pathname, item);
        const targetPath =
          item.id === "profile" ? (authUser ? "/my-schedule" : "/login") : item.path;

        return (
          <button
            key={item.id}
            type="button"
            className={clsx(styles.navItem, {
              [styles.navItemActive]: isActive,
              [styles.navItemCenter]: item.isCenter,
            })}
            onClick={() => navigate(targetPath)}
          >
            <span
              className={clsx(styles.iconShell, {
                [styles.iconShellCenter]: item.isCenter,
              })}
            >
              <Icon fontSize={item.isCenter ? "medium" : "small"} />
            </span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
