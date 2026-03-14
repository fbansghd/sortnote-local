import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../../App.module.scss";
import { ANIMATION_DURATION_SHORT, ANIMATION_EASING } from "../../constants";

function SortableCategory({ id, label, children, isOverlay, onDelete, onCollapse }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const categoryClass = `${styles.sortableCategory} ${isOverlay ? styles.overlay : ""} ${isDragging ? styles.dragging : ""}`;

  return (
    <div
      ref={setNodeRef}
      className={categoryClass}
      style={{
        transform: transform ? CSS.Transform.toString({ ...transform, y: 0 }) : undefined,
        transition: transition || `transform ${ANIMATION_DURATION_SHORT}s ${ANIMATION_EASING}`,
      }}
      {...attributes}
    >
      <div className={styles.categoryHandle}>
        <span
          {...listeners}
          {...attributes}
          className={styles.handleLabel}
        >
          {label}
        </span>
        <div className={styles.buttonGroup}>
          <span
            className={styles.collapseBtn}
            tabIndex={0}
            role="button"
            aria-label="カテゴリをたたむ"
            onClick={onCollapse}
          >
            ー
          </span>
          <span
            className={styles.deleteIcon}
            onClick={onDelete}
            tabIndex={0}
            role="button"
            aria-label="カテゴリ削除"
          >
            ｘ
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

export default SortableCategory;
