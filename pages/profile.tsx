import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ButtonLogin from "@/components/button-login";
import styles from "@/styles/Profile.module.css";
import HamburgerMenu from "../components/HamburgerMenu";

export default function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    income: "",
    family: "",
    history: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const onLogoMediBuddyImageClick = () => {
    router.push("/");
  };

  const goToProfile = () => {
    setMenuOpen(false);
    router.push("/profile");
  };

  const logout = () => {
    setMenuOpen(false);
    alert("ログアウトしました（ダミー）");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        const userId = "current-user-id";
        const response = await fetch(`/api/users?id=${userId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setIsEditing(true);
            setHasProfile(false);
            return;
          }
          throw new Error("プロフィールの取得に失敗しました");
        }

        const data = await response.json();
        setFormData({
          name: data.name || "",
          gender: data.gender || "",
          age: data.age?.toString() || "",
          income: data.income?.toString() || "",
          family: data.family || "",
          history: data.history || "",
        });
        setHasProfile(true);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error instanceof Error ? error.message : "予期せぬエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "current-user-id",
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          income: parseInt(formData.income),
          family: formData.family,
          medicalHistory: formData.history,
          allergies: "",
          medications: "",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "プロフィールの保存に失敗しました");
      }

      setIsEditing(false);
      setHasProfile(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}>読み込み中...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
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

      <div className={styles.container}>
        <h1 className={styles.title}>プロフィール</h1>
        {!isEditing ? (
          <div className={styles.profileView}>
            <div className={styles.profileInfo}>
              <p><strong>お名前：</strong> {formData.name}</p>
              <p><strong>性別：</strong> {
                formData.gender === "male" ? "男性" :
                formData.gender === "female" ? "女性" :
                formData.gender === "other" ? "その他" : ""
              }</p>
              <p><strong>年齢：</strong> {formData.age}歳</p>
              <p><strong>年収：</strong> {formData.income}万円</p>
              <p><strong>家族構成：</strong> {formData.family}</p>
              <p><strong>病歴：</strong> {formData.history || "なし"}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              編集する
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">お名前</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">性別</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">選択してください</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="age">年齢</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="income">年収（万円）</label>
              <input
                type="number"
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="family">家族構成</label>
              <input
                type="text"
                id="family"
                name="family"
                value={formData.family}
                onChange={handleChange}
                placeholder="例：配偶者あり、子供2人"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="history">病歴</label>
              <textarea
                id="history"
                name="history"
                value={formData.history}
                onChange={handleChange}
                placeholder="過去の病気や手術歴があれば記入してください"
                rows={4}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>
                保存する
              </button>
              {hasProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={styles.cancelButton}
                >
                  キャンセル
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 