import styles from "../App.module.scss";

function MobileNavigation({ direction, onClick }) {
  return (
    <div className={styles.categorySwitchArrows}>
      <button
        className={styles.categoryArrowBtn}
        onClick={onClick}
        aria-label={direction === "prev" ? "前のカテゴリー" : "次のカテゴリー"}
      >
        {direction === "prev" ? "←" : "→"}
      </button>
    </div>
  );
}

export default MobileNavigation;
