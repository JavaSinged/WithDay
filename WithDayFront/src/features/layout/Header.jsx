import { useEffect, useRef, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import styles from "./Header.module.css";
import { getAuthUser } from "../auth/lib/getAuthUser";

const REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "제주",
];

const buildSearchPath = (keyword, region) => {
  const params = new URLSearchParams();

  if (keyword) {
    params.set("keyword", keyword);
  }

  if (region) {
    params.set("region", region);
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const regionMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const authUser = getAuthUser();
  const isHome = location.pathname === "/";
  const selectedRegion = searchParams.get("region") ?? REGIONS[0];
  const keyword = searchParams.get("keyword") ?? "";
  const profileLabel =
    authUser?.nickname?.trim()?.slice(0, 1) ??
    authUser?.name?.trim()?.slice(0, 1) ??
    authUser?.email?.trim()?.slice(0, 1)?.toUpperCase() ??
    "W";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionMenuRef.current && !regionMenuRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextKeyword = searchInputRef.current?.value?.trim() ?? "";
    navigate(buildSearchPath(nextKeyword, selectedRegion));
  };

  const handleRegionSelect = (region) => {
    setIsRegionOpen(false);

    if (isHome) {
      navigate(buildSearchPath(searchInputRef.current?.value?.trim() ?? keyword, region));
    }
  };

  const searchInputProps = {
    key: keyword,
    ref: searchInputRef,
    type: "search",
    className: styles.searchInput,
    defaultValue: keyword,
    placeholder: "검색어를 입력하세요",
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.logoButton}
          onClick={() => navigate("/")}
          aria-label="홈으로 이동"
        >
          <div className={styles.logoBadge}>
            <Groups2RoundedIcon fontSize="small" />
          </div>
          <div>
            <strong className={styles.logoText}>WithMe</strong>
            <p className={styles.logoSubtext}>함께라서 더 쉬운 일정 찾기</p>
          </div>
        </button>

        <div className={styles.actionGroup}>
          <button
            type="button"
            className={clsx(styles.iconButton, styles.mobileOnlyButton)}
            aria-label="검색"
          >
            <SearchRoundedIcon />
          </button>
          <button type="button" className={styles.iconButton} aria-label="알림">
            <NotificationsNoneRoundedIcon />
          </button>
          <button
            type="button"
            className={styles.accountButton}
            aria-label="계정"
            onClick={() => navigate("/login")}
          >
            {profileLabel}
          </button>
        </div>
      </div>

      <div className={styles.mobileSearchRow}>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <SearchRoundedIcon className={styles.searchIcon} />
          <input {...searchInputProps} />
        </form>
      </div>

      <div className={styles.desktopSearchGroup}>
        <div ref={regionMenuRef} className={styles.regionArea}>
          <button
            type="button"
            className={clsx(styles.regionButton, {
              [styles.regionButtonOpen]: isRegionOpen,
            })}
            onClick={() => setIsRegionOpen((prev) => !prev)}
          >
            <span>{selectedRegion}</span>
            <KeyboardArrowDownRoundedIcon fontSize="small" />
          </button>

          {isRegionOpen && (
            <div className={styles.regionMenu}>
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  className={clsx(styles.regionMenuItem, {
                    [styles.regionMenuItemActive]: region === selectedRegion,
                  })}
                  onClick={() => handleRegionSelect(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <SearchRoundedIcon className={styles.searchIcon} />
          <input {...searchInputProps} />
        </form>
      </div>
    </header>
  );
}
