import type { NextPage } from "next";
import styles from "./textarea-field.module.css";

export type TextareaFieldType = {
  className?: string;
  hasDescription?: boolean;
  label?: string;
  hasError?: boolean;
  description?: string;
  error?: string;
  hasLabel?: boolean;

  /** Variant props */
  state?: string;
  valueType?: string;
};

const TextareaField: NextPage<TextareaFieldType> = ({
  className = "",
  state = "Default",
  valueType = "Placeholder",
  hasDescription = false,
  label,
  hasError = false,
  description = "Description",
  error = "Hint",
  hasLabel = false,
}) => {
  return (
    <section
      className={[styles.textareaConditions, className].join(" ")}
      data-state={state}
      data-valueType={valueType}
    >
      {!!hasLabel && <div className={styles.label}>{label}</div>}
      {!!hasDescription && (
        <div className={styles.description}>{description}</div>
      )}
      <textarea
        className={styles.textarea}
        placeholder="症状・病名を入力してください"
        rows={4}
        cols={17}
      />
      {!!hasError && <div className={styles.hint}>{error}</div>}
    </section>
  );
};

export default TextareaField;
