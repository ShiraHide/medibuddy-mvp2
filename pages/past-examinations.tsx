import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./past-examinations.module.css";
import Header from "../components/Header";

interface Examination {
  id: string;
  date: string;
  hospital: string;
  summary: string;
}

const PastExaminations: NextPage = () => {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);

  // ダミーデータ（実際のアプリケーションではAPIから取得）
  const examinations: Examination[] = [
    {
      id: "1",
      date: "2024年3月15日",
      hospital: "東京中央病院",
      summary: "風邪症状の診察。発熱、咳、喉の痛みがあり、急性上気道炎と診断。解熱剤と咳止め薬を処方。"
    },
    {
      id: "2",
      date: "2024年2月28日",
      hospital: "東京中央病院",
      summary: "定期健診。血圧、血液検査、心電図検査を実施。特に異常なし。"
    },
    {
      id: "3",
      date: "2024年1月15日",
      hospital: "東京中央病院",
      summary: "腰痛の診察。レントゲン検査の結果、軽度の腰椎症と診断。痛み止めの湿布を処方。"
    }
  ];

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

  const onExaminationClick = (id: string) => {
    router.push(`/examination-detail?id=${id}`);
  };

  const onShareClick = (e: React.MouseEvent, examination: Examination) => {
    e.stopPropagation(); // クリックイベントの伝播を停止
    // 共有機能の実装（例：クリップボードにコピー）
    const shareText = `診察日: ${examination.date}\n病院: ${examination.hospital}\n概要: ${examination.summary}`;
    navigator.clipboard.writeText(shareText)
      .then(() => alert('診察情報をクリップボードにコピーしました'))
      .catch(err => console.error('クリップボードへのコピーに失敗しました:', err));
  };

  return (
    <div className={styles.pastexaminations}>
      <Header hasProfile={hasProfile} />
      <main className={styles.container}>
        <h1 className={styles.title}>過去の診察一覧</h1>
        <div className={styles.examinationList}>
          {examinations.map((examination) => (
            <div
              key={examination.id}
              className={styles.examinationItem}
              onClick={() => onExaminationClick(examination.id)}
            >
              <div className={styles.examinationContent}>
                <div className={styles.examinationHeader}>
                  <div className={styles.date}>{examination.date}</div>
                  <div className={styles.hospital}>{examination.hospital}</div>
                </div>
                <div className={styles.summary}>{examination.summary}</div>
              </div>
              <button
                className={styles.shareButton}
                onClick={(e) => onShareClick(e, examination)}
              >
                <Image
                  src="/share-icon.png"
                  alt="共有"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PastExaminations; 