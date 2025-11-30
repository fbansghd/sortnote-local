import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import styles from "../App.module.scss";

export function useTheme() {
  const [isAltColor, setIsAltColor] = useLocalStorage("isAltColor", false);

  useEffect(() => {
    document.body.classList.remove(styles.themeA, styles.themeB);
    document.body.classList.add(isAltColor ? styles.themeB : styles.themeA);
  }, [isAltColor]);

  return { isAltColor, setIsAltColor };
}
