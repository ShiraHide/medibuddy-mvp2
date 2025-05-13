import type { NextPage } from "next";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ButtonLogin from "../components/button-login";
import Button1 from "../components/button1";
import styles from "./during-medical-examination.module.css";
import HamburgerMenu from "../components/HamburgerMenu";

const DuringMedicalExamination: NextPage = () => {
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
    router.push("/record-examination");
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
    <div className={styles.duringmedicalexamination}>
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
          <h1 className={styles.h1}>診察中のサポート</h1>
        </div>
        <div className={styles.copySub}>
          <div className={styles.div}>
            診察中に医師との会話を記録し、重要なポイントをメモします。診察後に振り返りができるように、診察内容を整理します。
          </div>
        </div>
      </section>
      <section className={styles.imageContainer}>
        <Image
          className={styles.image1Icon}
          loading="lazy"
          width={300}
          height={300}
          alt="診察中のサポート"
          src="/image-during-medical-examination.png"
        />
      </section>
      <button className={styles.buttonGotoquestiongeneration}>
        <Button1
          showIcon={false}
          state="Enabled"
          style="Outlined"
          labelText="診察内容を記録する"
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
          labelText="過去の診察記録を確認する"
        />
      </button>
    </div>
  );
};

export default DuringMedicalExamination; 