import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Button from "./button";
import styles from "./button-login.module.css";

export type ButtonLoginType = {
  className?: string;

  /** Style props */
  buttonLoginBorder?: CSSProperties["border"];
  buttonLoginPadding?: CSSProperties["padding"];
  buttonLoginBackgroundColor?: CSSProperties["backgroundColor"];
};

const ButtonLogin: NextPage<ButtonLoginType> = ({
  className = "",
  buttonLoginBorder,
  buttonLoginPadding,
  buttonLoginBackgroundColor,
}) => {
  const buttonLoginStyle: CSSProperties = useMemo(() => {
    return {
      border: buttonLoginBorder,
      padding: buttonLoginPadding,
      backgroundColor: buttonLoginBackgroundColor,
    };
  }, [buttonLoginBorder, buttonLoginPadding, buttonLoginBackgroundColor]);

  return (
    <div
      className={[styles.buttonLogin, className].join(" ")}
      style={buttonLoginStyle}
    >
      <Button
        size="Small"
        state="Default"
        variant="Neutral"
        hasIconEnd={false}
        hasIconStart={false}
        label="ログイン"
      />
    </div>
  );
};

export default ButtonLogin;
