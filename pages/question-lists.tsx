import type { NextPage } from "next";
import { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ButtonLogin from "../components/button-login";
import HamburgerMenu from "../components/HamburgerMenu";
import styles from "./question-lists.module.css";

interface QuestionList {
  id: string;
  questions: string[];
  createdAt: string;
}

const QuestionLists: NextPage = () => {
  const router = useRouter();
  const [questionLists, setQuestionLists] = useState<QuestionList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuestions, setEditingQuestions] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const onLogoMediBuddyImageClick = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    const fetchQuestionLists = async () => {
      try {
        const userId = "current-user-id"; // TODO: 実際のユーザーIDを使用
        const response = await fetch(`/api/question-lists?userId=${userId}`);
        if (!response.ok) {
          throw new Error("質問リストの取得に失敗しました");
        }
        const data = await response.json();
        setQuestionLists(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "予期せぬエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionLists();
  }, []);

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

  const logout = () => {
    setMenuOpen(false);
    // ログアウト処理
    alert("ログアウトしました（ダミー）");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (listId: string, questions: string) => {
    setEditingId(listId);
    setEditingQuestions(questions);
    setEditError(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingQuestions("");
    setEditError(null);
  };

  const handleEditSave = async (listId: string) => {
    setEditLoading(true);
    setEditError(null);
    try {
      const response = await fetch("/api/question-lists", {
        method: "POST", // 本来はPATCHが望ましいが、既存APIに合わせる
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: listId,
          userId: "current-user-id",
          questions: editingQuestions,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "保存に失敗しました");
      }
      // 編集後リストを再取得
      const userId = "current-user-id";
      const res = await fetch(`/api/question-lists?userId=${userId}`);
      const data = await res.json();
      setQuestionLists(data);
      setEditingId(null);
      setEditingQuestions("");
    } catch (e: any) {
      setEditError(e.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (listId: string) => {
    if (!window.confirm("本当にこの質問リストを削除しますか？")) return;
    try {
      const response = await fetch(`/api/question-lists?id=${listId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "削除に失敗しました");
      }
      // 削除後リストを再取得
      const userId = "current-user-id";
      const res = await fetch(`/api/question-lists?userId=${userId}`);
      const data = await res.json();
      setQuestionLists(data);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className={styles.questionlists}>
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
          <h1 className={styles.h1}>保存した質問リスト</h1>
        </div>
      </section>

      {isLoading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : questionLists.length === 0 ? (
        <div className={styles.empty}>
          <p>保存された質問リストはありません</p>
          <button
            onClick={() => router.push("/question-generation")}
            className={styles.generateButton}
          >
            新しい質問を生成する
          </button>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {questionLists.map((list) => (
            <div key={list.id} className={styles.listItem}>
              <div className={styles.listHeader}>
                <span className={styles.date}>{formatDate(list.createdAt)}</span>
                <div className={styles.buttonGroup}>
                  {editingId === list.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(list.id)}
                        className={styles.editButton}
                        disabled={editLoading}
                      >
                        {editLoading ? "保存中..." : "保存"}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className={styles.cancelButton}
                        disabled={editLoading}
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDelete(list.id)}
                        className={styles.deleteButton}
                      >
                        削除
                      </button>
                      <button
                        onClick={() => handleEdit(list.id, typeof list.questions === "string" ? list.questions : (list.questions as string[]).join("\n"))}
                        className={styles.editButton}
                      >
                        編集
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingId === list.id ? (
                <textarea
                  className={styles.textarea}
                  value={editingQuestions}
                  onChange={e => setEditingQuestions(e.target.value)}
                  rows={6}
                  style={{ width: "100%", marginTop: 8 }}
                  disabled={editLoading}
                />
              ) : (
                <ul className={styles.questions}>
                  {(typeof list.questions === "string"
                    ? (list.questions as string).split("\n")
                    : (list.questions as string[])
                  ).map((question: string, index: number) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              )}
              {editingId === list.id && editError && (
                <div className={styles.error}>{editError}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionLists; 