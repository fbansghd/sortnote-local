import { useState } from "react";
import styles from "../../App.module.scss";

function TaskInput({
  categoryId,
  isTaskInputVisible,
  onToggleTaskInput,
  taskInputs,
  onInputChange,
  onKeyDown,
  onAddClick,
}) {
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className={styles.inputBtnContainer}>
      <div className={styles.inputBtn}>
        <span
          className={styles.inputToggleIcon}
          onClick={() => onToggleTaskInput(categoryId)}
          tabIndex={0}
          role="button"
          aria-label="タスク入力欄の表示切替"
          style={{ marginTop: "0.5rem" }}
        >
          {isTaskInputVisible[categoryId] ? "−" : "+"}
        </span>
      </div>
      <div>
        {isTaskInputVisible[categoryId] && (
          <div className={styles.memoInputStyle}>
            <input
              className={styles.memoInput}
              placeholder="input task"
              value={taskInputs[categoryId] || ""}
              onChange={(e) => onInputChange(categoryId, e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => onKeyDown(categoryId, e, isComposing)}
            />
            <button className={styles.addBtn} onClick={() => onAddClick(categoryId)}>
              add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskInput;
