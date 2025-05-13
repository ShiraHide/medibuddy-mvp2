import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "./examination-detail.module.css";
import Header from "../components/Header";

interface ExaminationDetail {
  id: string;
  date: string;
  hospital: string;
  summary: string;
  details: {
    symptoms: string[];
    diagnosis: string;
    treatment: string;
    medications: string[];
    notes: string;
  };
  transcription: string;
}

const ExaminationDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [hasProfile, setHasProfile] = useState(false);

  // ダミーデータ（実際のアプリケーションではAPIから取得）
  const examinationDetail: ExaminationDetail = {
    id: id as string,
    date: "2024年3月15日",
    hospital: "東京中央病院",
    summary: "風邪症状の診察",
    details: {
      symptoms: ["発熱（38.5℃）", "咳", "喉の痛み"],
      diagnosis: "急性上気道炎",
      treatment: "安静、水分補給",
      medications: ["解熱剤", "咳止め薬"],
      notes: "3日間の安静が必要。症状が悪化した場合は再受診を推奨。"
    },
    transcription: "医師：今日はどうされましたか？\n患者：昨日から熱が出て、咳も出るようになりました。\n医師：体温は測られましたか？\n患者：はい、38.5度ありました。\n医師：喉の痛みはありますか？\n患者：はい、少し痛みがあります。\n医師：風邪の症状ですね。安静にして、水分を十分に取ってください。\n処方箋を出しますので、薬局で受け取ってください。\n患者：ありがとうございます。\n医師：3日間様子を見て、症状が悪化する場合は再受診してください。"
  };

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

  return (
    <div className={styles.examinationDetail}>
      <Header hasProfile={hasProfile} />

      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <span onClick={() => router.push("/past-examinations")}>過去の診察</span>
          <span className={styles.separator}>/</span>
          <span>診察詳細</span>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.header}>
            <h1>{examinationDetail.date}の診察</h1>
            <div className={styles.hospital}>{examinationDetail.hospital}</div>
          </div>

          <div className={styles.summary}>
            <h2>診察概要</h2>
            <p>{examinationDetail.summary}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.section}>
              <h3>症状</h3>
              <ul>
                {examinationDetail.details.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3>診断</h3>
              <p>{examinationDetail.details.diagnosis}</p>
            </div>

            <div className={styles.section}>
              <h3>治療方針</h3>
              <p>{examinationDetail.details.treatment}</p>
            </div>

            <div className={styles.section}>
              <h3>処方薬</h3>
              <ul>
                {examinationDetail.details.medications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3>注意事項</h3>
              <p>{examinationDetail.details.notes}</p>
            </div>
          </div>

          <div className={styles.transcriptionSection}>
            <h2>診察記録</h2>
            <button 
              className={styles.transcriptionButton}
              onClick={() => {
                const transcriptionWindow = window.open('', '_blank');
                if (transcriptionWindow) {
                  transcriptionWindow.document.write(`
                    <html>
                      <head>
                        <title>診察記録 - ${examinationDetail.date}</title>
                        <style>
                          body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
                          .transcription { white-space: pre-wrap; }
                        </style>
                      </head>
                      <body>
                        <h1>${examinationDetail.date}の診察記録</h1>
                        <div class="transcription">${examinationDetail.transcription}</div>
                      </body>
                    </html>
                  `);
                }
              }}
            >
              診察記録を表示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDetail; 