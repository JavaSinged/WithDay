import styles from "./Button.module.css";
import clsx from "clsx";

function Button({
  children,
  variant = "primary", // primary | accent | outline
  size = "md", // sm | md | lg
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant], styles[size], {
        [styles.fullWidth]: fullWidth,
        [styles.disabled]: disabled,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
