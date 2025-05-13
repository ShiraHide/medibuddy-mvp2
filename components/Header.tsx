import { useRouter } from "next/router";
import Image from "next/image";
import ButtonLogin from "./button-login";
import HamburgerMenu from "./HamburgerMenu";
import { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  hasProfile?: boolean;
}

const Header = ({ hasProfile = false }: HeaderProps) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const onLogoClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.header}>
      <Image
        className={styles.logomedibuddyIcon}
        alt="MediBuddy"
        src="/logomedibuddy@2x.png"
        width={180}
        height={50}
        onClick={onLogoClick}
      />
      <div className={styles.rightSection}>
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
          logout={() => {
            setMenuOpen(false);
            alert("ログアウトしました（ダミー）");
          }}
        />
      </div>
    </div>
  );
};

export default Header; 