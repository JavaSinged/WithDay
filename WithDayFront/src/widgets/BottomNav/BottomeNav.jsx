import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const [value, setValue] = useState(0);

  return (
    <div className={styles.wrapper}>
      <BottomNavigation
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        showLabels
      >
        <BottomNavigationAction label="홈" icon={<HomeIcon />} />
        <BottomNavigationAction label="탐색" icon={<SearchIcon />} />
        <BottomNavigationAction
          icon={<AddCircleIcon className={styles.addBtn} />}
        />
        <BottomNavigationAction label="채팅" icon={<ChatIcon />} />
        <BottomNavigationAction label="마이" icon={<PersonIcon />} />
      </BottomNavigation>
    </div>
  );
}
