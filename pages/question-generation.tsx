import type { NextPage } from "next";
import { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ButtonLogin from "../components/button-login";
import TextareaField from "../components/textarea-field";
import Button1 from "../components/button1";
import styles from "./question-generation.module.css";
import HamburgerMenu from "../components/HamburgerMenu";

const QuestionGeneration: NextPage = () => {
  const router = useRouter();

  // 入力値・出力・ローディング・エラー状態
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 編集・保存用のstate
  const [editableQuestions, setEditableQuestions] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [questionItems, setQuestionItems] = useState<{ text: string; selected: boolean }[]>([]);
  const [showList, setShowList] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const onLogoMediBuddyImageClick = useCallback(() => {
    router.push("/");
  }, [router]);

  // 質問生成後に編集モードに
  useEffect(() => {
    if (result) {
      setEditableQuestions(result);
      setIsEditing(true);
    }
  }, [result]);

  // 質問生成後にリストを分割してstateにセット
  useEffect(() => {
    if (result) {
      // 箇条書きで分割、1行もしくは空でなければ1つの項目として扱う
      const items = result
        .split(/\n/)
        .map(line => line.replace(/^(\s*[\d\-・\u2022]+\.?\s*)/, ""))
        .filter(line => line.trim() !== "")
        .map(line => ({ text: line, selected: true }));

      if (items.length === 0 && result.trim() !== "") {
        setQuestionItems([{ text: result.trim(), selected: true }]);
      } else {
        setQuestionItems(items);
      }
      setShowList(true);
    }
  }, [result]);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userId = "current-user-id";
        const response = await fetch(`/api/users?id=${userId}`);
        setHasProfile(response.ok);
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };
    checkProfile();
  }, []);

  const logout = () => {
    setMenuOpen(false);
    // ログアウト処理
    alert("ログアウトしました（ダミー）");
  };

  // 採用/不採用の切り替え
  const toggleSelect = (idx: number) => {
    setQuestionItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // 保存処理
  const handleSave = async () => {
    const adopted = questionItems.filter(item => item.selected).map(item => item.text);
    if (adopted.length === 0) {
      setError("保存する質問を選択してください");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/question-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "current-user-id", // TODO: 実際のユーザーIDを使用
          questions: adopted.join("\n"), // 配列ではなく改行区切りの文字列で送信
        }),
      });

      if (!response.ok) {
        let errorMessage = "質問リストの保存に失敗しました";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage += `: ${errorData.error}`;
          }
        } catch (e) {
          // JSONでない場合は無視
        }
        throw new Error(errorMessage);
      }

      setSaveSuccess(true);
      // 保存成功後、質問リストページに遷移
      router.push("/question-lists");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "予期せぬエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  // 編集開始
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 質問生成ボタン押下時の処理
  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("症状や病名を入力してください。");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "エラーが発生しました。");
      }
    } catch (e: any) {
      setError(e.message || "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.questiongeneration}>
      <div className={styles.header}>
        <Image
          className={styles.logomedibuddyIcon}
          loading="lazy"
          width={180}
          height={50}
          alt=""
          src="/logomedibuddy@2x.png"
          onClick={onLogoMediBuddyImageClick}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ButtonLogin
            buttonLoginBorder="none"
            buttonLoginPadding="0"
            buttonLoginBackgroundColor="transparent"
          />
          <HamburgerMenu
            hasProfile={hasProfile}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            menuRef={menuRef}
            logout={logout}
          />
        </div>
      </div>
      <section className={styles.copies}>
        <div className={styles.copyMain}>
          <h1 className={styles.h1}>質問リストの生成</h1>
        </div>
        <div className={styles.copySub}>
          <div className={styles.div}>
            あなたの現在の症状・疑われる病名を入力してください。
          </div>
        </div>
      </section>
      {/* 入力欄 */}
      <section style={{ width: "100%", alignSelf: "stretch" }}>
        <textarea
          className={styles.textarea}
          placeholder="症状・病名を入力してください"
          rows={8}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </section>
      {/* ボタン */}
      <button
        className={styles.buttonGeneratequestionlist}
        onClick={handleGenerate}
        disabled={loading}
      >
        <Button1
          showIcon={false}
          state={loading ? "Disabled" : "Enabled"}
          style="Outlined"
          labelText={loading ? "生成中..." : "質問を生成する"}
        />
      </button>
      {/* エラー表示 */}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {/* 結果表示・編集・保存 */}
      {showList && (
        <section style={{ marginTop: 32, width: "100%" }}>
          <h2>質問リスト</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {questionItems.length > 0 ? questionItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(idx)}
                  style={{ marginRight: 8 }}
                />
                <span style={{ opacity: item.selected ? 1 : 0.5 }}>{item.text}</span>
              </li>
            )) : (
              <li>質問がありません</li>
            )}
          </ul>
          <div className={styles.saveSection}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? "保存中..." : "採用した質問を保存"}
            </button>
            {saveError && <p className={styles.error}>{saveError}</p>}
            {saveSuccess && <p className={styles.success}>質問リストを保存しました</p>}
          </div>
        </section>
      )}
    </div>
  );
};

export default QuestionGeneration;
