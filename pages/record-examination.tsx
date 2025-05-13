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
  const [conversations, setConversations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ダミーの会話データ
  const dummyConversations = [
    "医師：今日はどうされましたか？",
    "患者：昨日から熱が出て、咳も出るようになりました。",
    "医師：体温は測られましたか？",
    "患者：はい、38.5度ありました。",
    "医師：喉の痛みはありますか？",
    "患者：はい、少し痛みがあります。",
    "医師：風邪の症状ですね。安静にして、水分を十分に取ってください。",
    "医師：処方箋を出しますので、薬局で受け取ってください。",
    "患者：ありがとうございます。",
    "医師：3日間様子を見て、症状が悪化する場合は再受診してください。"
  ];

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

  // 会話を自動的に追加する関数
  const addConversation = useCallback(() => {
    if (isRecording && currentIndex < dummyConversations.length) {
      setConversations(prev => [...prev, dummyConversations[currentIndex]]);
      setCurrentIndex(prev => prev + 1);
    }
  }, [isRecording, currentIndex]);

  // 録音停止時の処理
  const handleStopRecording = () => {
    setIsRecording(false);
    router.push("/during-medical-examination");
  };

  // 定期的に会話を追加
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(addConversation, 2000); // 2秒ごとに会話を追加
      return () => clearInterval(interval);
    }
  }, [isRecording, addConversation]);

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
        <div className={`${styles.recordingIndicator} ${isRecording ? styles.recording : ''}`}>
          録音中
        </div>
      </div>
      <div className={styles.transcriptionContainer}>
        <h2>診察のやりとり</h2>
        <div className={styles.conversationList}>
          {conversations.map((conversation, index) => (
            <div key={index} className={styles.conversationItem}>
              {conversation}
            </div>
          ))}
        </div>
      </div>
      <button className={styles.stopButton} onClick={handleStopRecording}>
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