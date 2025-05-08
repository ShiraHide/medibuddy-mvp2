import type { NextPage } from "next";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ButtonLogin from "../components/button-login";
import Button1 from "../components/button1";
import styles from "./index.module.css";

const TopPage: NextPage = () => {
  const router = useRouter();

  // ハンバーガーメニュー用のstate
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

  const goToProfile = () => {
    setMenuOpen(false);
    router.push("/profile");
  };

  const logout = () => {
    setMenuOpen(false);
    alert("ログアウトしました（ダミー）");
  };

  const onButtonBeforeExaminationContainerClick = useCallback(() => {
    router.push("/before-medical-examination");
  }, [router]);

  return (
    <div className={styles.toppage}>
      <div className={styles.header}>
        <Image
          className={styles.logomedibuddyIcon}
          loading="lazy"
          width={180}
          height={50}
          alt=""
          src="/logomedibuddy@2x.png"
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className={styles.buttonLoginWrapper}>
            <ButtonLogin />
          </button>
          {/* ハンバーガーメニュー */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <img
              src="/menu-icon.png"
              alt="メニュー"
              style={{ width: 32, height: 32, cursor: "pointer" }}
              onClick={() => setMenuOpen(open => !open)}
            />
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 100,
                  minWidth: 200,
                }}
              >
                <ul style={{ listStyle: "none", margin: 0, padding: 8 }}>
                  <li style={{ padding: "8px 16px", borderBottom: "1px solid #eee" }}>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                      プロフィール情報
                    </div>
                    {hasProfile ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/profile");
                          }}
                          style={{
                            width: "100%",
                            padding: "8px",
                            background: "#f5f5f5",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          プロフィールを表示
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/profile?edit=true");
                          }}
                          style={{
                            width: "100%",
                            padding: "8px",
                            background: "#0070f3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          プロフィールを編集
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          router.push("/profile?edit=true");
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "#0070f3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        プロフィールを作成
                      </button>
                    )}
                  </li>
                  <li style={{ padding: "8px 16px", borderBottom: "1px solid #eee" }}>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                      質問リスト
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          router.push("/question-generation");
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "#f5f5f5",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        新しい質問を生成
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          router.push("/question-lists");
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "#0070f3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        保存した質問リスト
                      </button>
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      style={{
                        width: "100%",
                        padding: "8px 16px",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        color: "#666",
                      }}
                    >
                      ログアウト
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <section className={styles.copies}>
        <div className={styles.copyMain}>
          <h1 className={styles.h1}>一人じゃない診察へ。</h1>
        </div>
        <div className={styles.copySub}>
          <div className={styles.medibuddy}>
            <p className={styles.p}>
              症状の整理、質問の準備、診察の記録、そして振り返り。MediBuddyは、診察という大事な時間を支える
            </p>
            <p className={styles.p}>"あなたのもうひとりの同行者"です。</p>
          </div>
        </div>
      </section>
      <button className={styles.buttonBeforeexamination}>
        <Button1
          showIcon={false}
          state="Enabled"
          style="Outlined"
          labelText="診察前の準備"
          onButtonBeforeExaminationContainerClick={
            onButtonBeforeExaminationContainerClick
          }
        />
      </button>
      <button className={styles.buttonBeforeexamination}>
        <Button1
          showIcon={false}
          state="Enabled"
          style="Outlined"
          labelText="診察中のサポート"
        />
      </button>
      <button className={styles.buttonBeforeexamination}>
        <Button1
          showIcon={false}
          state="Enabled"
          style="Outlined"
          labelText="過去の診察内容"
        />
      </button>
    </div>
  );
};

export default TopPage;
