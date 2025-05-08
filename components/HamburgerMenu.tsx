import { Dispatch, SetStateAction, RefObject } from "react";
import { useRouter } from "next/router";

interface HamburgerMenuProps {
  hasProfile: boolean;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  menuRef: RefObject<HTMLDivElement>;
  logout: () => void;
}

const HamburgerMenu = ({ hasProfile, menuOpen, setMenuOpen, menuRef, logout }: HamburgerMenuProps) => {
  const router = useRouter();
  return (
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
  );
};

export default HamburgerMenu; 