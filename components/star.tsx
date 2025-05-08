import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";
import styles from "./star.module.css";

export type StarType = {
  className?: string;
  icon: string;

  /** Variant props */
  size?: 16;

  /** Style props */
  starDisplay?: CSSProperties["display"];
};

const Star: NextPage<StarType> = ({
  className = "",
  size = 48,
  icon,
  starDisplay,
}) => {
  const starStyle: CSSProperties = useMemo(() => {
    return {
      display: starDisplay,
    };
  }, [starDisplay]);

  return (
    <div
      className={[styles.star, className].join(" ")}
      data-size={size}
      style={starStyle}
    >
      <Image className={styles.icon} width={13} height={13} alt="" src={icon} />
    </div>
  );
};

export default Star;
