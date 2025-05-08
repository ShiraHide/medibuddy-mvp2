import type { NextPage } from "next";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ButtonLogin from "../components/button-login";
import Button1 from "../components/button1";
import styles from "./before-medical-examination.module.css";
import HamburgerMenu from "../components/HamburgerMenu";

const BeforeMedicalExamination: NextPage = () => {
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

  const onButtonGoToQuestionGenerationContainerClick = useCallback(() => {
    router.push("/question-generation");
  }, [router]);

  const onLogoMediBuddyImageClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const goToProfile = () => {
    setMenuOpen(false);
    router.push("/profile");
  };

  const logout = () => {
    setMenuOpen(false);
    alert("ログアウトしました（ダミー）");
  };

  return (
    <div className={styles.beforemedicalexamination}>
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
          <h1 className={styles.h1}>診察前の準備</h1>
        </div>
        <div className={styles.copySub}>
          <div className={styles.div}>
            診察時に医師に聞くべき質問を、あなたの症状や疑われる病名から自動的に生成します。生成した質問リストは保存・修正も可能です。
          </div>
        </div>
      </section>
      <section className={styles.imageContainer}>
        <Image
          className={styles.image1Icon}
          loading="lazy"
          width={215}
          height={209}
          alt=""
          src="/image-1@2x.png"
        />
      </section>
      <button className={styles.buttonGotoquestiongeneration}>
        <Button1
          showIcon={false}
          state="Enabled"
          style="Outlined"
          labelText="医師への質問リストを生成する"
          onButtonBeforeExaminationContainerClick={
            onButtonGoToQuestionGenerationContainerClick
          }
        />
      </button>
      <button className={styles.buttonGotoquestiongeneration} onClick={() => router.push("/question-lists") }>
        <Button1
          showIcon={false}
          state="Enabled"
          style="Outlined"
          labelText="過去の質問リストを確認する"
        />
      </button>
    </div>
  );
};

export default BeforeMedicalExamination;
