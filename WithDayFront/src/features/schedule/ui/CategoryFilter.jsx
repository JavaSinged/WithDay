import clsx from "clsx";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import styles from "./CategoryFilter.module.css";

const CATEGORY_ICON_MAP = {
  all: AppsRoundedIcon,
  travel: TravelExploreRoundedIcon,
  popup: StorefrontRoundedIcon,
  food: RestaurantRoundedIcon,
  culture: TheaterComedyRoundedIcon,
  activity: DirectionsRunRoundedIcon,
  etc: ExploreRoundedIcon,
};

const renderCategoryButton = ({ id, label }, activeCategory, onCategoryChange) => {
  const Icon = CATEGORY_ICON_MAP[id] ?? ExploreRoundedIcon;

  return (
    <button
      key={id}
      type="button"
      className={clsx(styles.chip, {
        [styles.chipActive]: activeCategory === id,
      })}
      onClick={() => onCategoryChange(id)}
    >
      <span className={styles.iconWrap}>
        <Icon fontSize="small" />
      </span>
      <span>{label}</span>
    </button>
  );
};

export default function CategoryFilter({
  categories = [],
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className={styles.list}>
      {categories.map((category) =>
        renderCategoryButton(category, activeCategory, onCategoryChange),
      )}
    </div>
  );
}
