import clsx from "clsx";
import styles from "./Participation.module.css";

const VARIANT_CLASS_MAP = {
  error: styles.errorState,
};

export default function EmptyState({
  message,
  variant = "default",
  withContainer = true,
}) {
  const content = (
    <div
      className={clsx(styles.stateBox, VARIANT_CLASS_MAP[variant])}
      role={variant === "error" ? "alert" : undefined}
    >
      {message}
    </div>
  );

  if (!withContainer) {
    return content;
  }

  return <div className={styles.listContainer}>{content}</div>;
}
