import type { NextPage } from "next";
import Star from "./star";
import X from "./x";
import styles from "./button.module.css";

export type ButtonType = {
  className?: string;
  hasIconEnd?: boolean;
  hasIconStart?: boolean;
  label?: string;

  /** Variant props */
  size?: string;
  state?: string;
  variant?: string;
};

const Button: NextPage<ButtonType> = ({
  className = "",
  size = "Medium",
  state = "Default",
  variant = "Primary",
  hasIconEnd = false,
  hasIconStart = false,
  label = "ログイン",
}) => {
  return (
    <div
      className={[styles.buttonLogin, className].join(" ")}
      data-size={size}
      data-state={state}
      data-variant={variant}
    >
      {!!hasIconStart && (
        <Star size={16} icon="/icon.svg" starDisplay="unset" />
      )}
      <div className={styles.button}>{label}</div>
      {!!hasIconEnd && <X size={16} icon="/icon-1.svg" xDisplay="unset" />}
    </div>
  );
};

export default Button;
