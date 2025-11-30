import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import styles from "../App.module.scss";

function SortableCategory({ id, label, children, isOverlay, transform: overlayTransform, onDelete, onCollapse }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const appliedTransform = isOverlay ? overlayTransform : transform;

  const categoryClass = `${styles.sortableCategory} ${isOverlay ? styles.overlay : ""} ${isDragging ? styles.dragging : ""}`;

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={isOverlay ? { opacity: 1, scale: 1, y: 10 } : false}
      animate={
        isOverlay
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={isOverlay ? { opacity: 0, scale: 1, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.03 }}
      className={categoryClass}
      style={{
        transform: appliedTransform ? CSS.Transform.toString(appliedTransform) : undefined,
        transition: transition || "transform 0.03s cubic-bezier(0.2, 0, 0, 1)",
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
    </motion.div>
  );
}

export default SortableCategory;
