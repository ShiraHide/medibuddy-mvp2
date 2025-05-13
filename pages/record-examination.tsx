import type { NextPage } from "next";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ButtonLogin from "../components/button-login";
import Button1 from "../components/button1";
import styles from "./record-examination.module.css";
import HamburgerMenu from "../components/HamburgerMenu";

const RecordExamination: NextPage = () => {
  const router = useRouter();

  // ハンバーガーメニュー用のstate
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 録音状態の管理
  const [isRecording, setIsRecording] = useState(true);

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

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className={styles.recordexamination}>
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
          <h1 className={styles.h1}>診察内容の記録</h1>
        </div>
      </section>
      <div className={styles.recordingStatus}>
        {isRecording && <div className={styles.recordingText}>録音中</div>}
      </div>
      <div className={styles.transcriptionContainer}>
        <div className={styles.transcriptionText}>
          <p>医師: こんにちは。今日はどのような症状でお越しになりましたか？</p>
          <p>患者: 最近、頭痛が続いていて、特に朝方に強い痛みを感じます。</p>
          <p>医師: 頭痛の具体的な症状について教えていただけますか？</p>
          <p>患者: 右側のこめかみ付近がズキズキと痛み、吐き気も伴うことがあります。</p>
          <p>医師: その症状はどのくらいの期間続いていますか？</p>
          <p>患者: 約2週間前から始まりました。</p>
        </div>
      </div>
      <button className={styles.stopButton} onClick={stopRecording}>
        <Button1
          showIcon={false}
          state="Enabled"
          style="Outlined"
          labelText="録音を停止する"
        />
      </button>
    </div>
  );
};

export default RecordExamination; 