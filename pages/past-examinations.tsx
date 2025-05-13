import type { NextPage } from "next";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ButtonLogin from "../components/button-login";
import Button1 from "../components/button1";
import styles from "./past-examinations.module.css";
import HamburgerMenu from "../components/HamburgerMenu";

interface Examination {
  id: string;
  date: string;
  hospital: string;
  summary: string;
}

const PastExaminations: NextPage = () => {
  const router = useRouter();

  // ハンバーガーメニュー用のstate
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ダミーデータ
  const [examinations] = useState<Examination[]>([
    {
      id: "1",
      date: "2024年3月15日 14:30",
      hospital: "東京中央病院",
      summary: "頭痛の症状について診察。片頭痛の可能性が高いと診断。"
    },
    {
      id: "2",
      date: "2024年2月28日 10:00",
      hospital: "東京中央病院",
      summary: "定期健診。血圧がやや高め。生活習慣の改善を指導。"
    },
    {
      id: "3",
      date: "2024年1月20日 15:45",
      hospital: "東京中央病院",
      summary: "風邪症状の診察。インフルエンザの検査は陰性。"
    }
  ]);

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

  const handleShare = (examination: Examination) => {
    // シェア機能のダミー実装
    alert(`${examination.date}の診察内容をシェアします。\n\n診察場所: ${examination.hospital}\n診察内容: ${examination.summary}`);
  };

  return (
    <div className={styles.pastexaminations}>
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
          <h1 className={styles.h1}>過去の診察一覧</h1>
        </div>
      </section>
      <div className={styles.examinationList}>
        {examinations.map((examination) => (
          <div key={examination.id} className={styles.examinationItem}>
            <div className={styles.examinationContent}>
              <div className={styles.examinationHeader}>
                <span className={styles.date}>{examination.date}</span>
                <span className={styles.hospital}>{examination.hospital}</span>
              </div>
              <p className={styles.summary}>{examination.summary}</p>
            </div>
            <button
              className={styles.shareButton}
              onClick={() => handleShare(examination)}
            >
              <Image
                src="/share-icon.png"
                alt="シェア"
                width={24}
                height={24}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastExaminations; 