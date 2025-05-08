import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";
import styles from "./x.module.css";

export type XType = {
  className?: string;
  icon: string;

  /** Variant props */
  size?: 16;

  /** Style props */
  xDisplay?: CSSProperties["display"];
};

const X: NextPage<XType> = ({ className = "", size = 48, icon, xDisplay }) => {
  const xStyle: CSSProperties = useMemo(() => {
    return {
      display: xDisplay,
    };
  }, [xDisplay]);

  return (
    <div
      className={[styles.x, className].join(" ")}
      data-size={size}
      style={xStyle}
    >
      <Image className={styles.icon} width={8} height={8} alt="" src={icon} />
    </div>
  );
};

export default X;
