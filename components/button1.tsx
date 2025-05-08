import type { NextPage } from "next";
import { useCallback } from "react";
import { useRouter } from "next/router";
import styles from "./button1.module.css";

export type Button1Type = {
  className?: string;
  labelText?: string;

  /** Variant props */
  showIcon?: boolean;
  state?: string;
  style?: string;

  /** Action props */
  onButtonBeforeExaminationContainerClick?: () => void;
};

const Button1: NextPage<Button1Type> = ({
  className = "",
  showIcon = true,
  state = "Disabled",
  style = "Tonal",
  labelText = "診察前の準備",
  onButtonBeforeExaminationContainerClick,
}) => {
  const router = useRouter();

  const onButtonBeforeExaminationContainerClick1 = useCallback(() => {
    router.push("/before-medical-examination");
  }, [router]);

  return (
    <div
      className={[styles.buttonBeforeexamination, className].join(" ")}
      onClick={onButtonBeforeExaminationContainerClick}
      data-showIcon={showIcon}
      data-state={state}
      data-style={style}
    >
      <div className={styles.stateLayer}>
        <b className={styles.label}>{labelText}</b>
      </div>
    </div>
  );
};

export default Button1;
