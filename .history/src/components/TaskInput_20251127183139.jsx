import styles from "../App.module.scss";

function TaskInput({
  categoryIndex,
  mobileCategoryIndex,
  isMobile,
  showTaskInput,
  toggleTaskInput,
  taskInputs,
  setTaskInputs,
  addTaskToCategory,
}) {
  const currentIdx = isMobile ? mobileCategoryIndex : categoryIndex;

  const handleInputChange = (e) => {
    const newInputs = [...taskInputs];
    newInputs[currentIdx] = e.target.value;
    setTaskInputs(newInputs);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTaskToCategory(currentIdx, taskInputs[currentIdx]);
    }
  };

  const handleAddClick = () => {
    addTaskToCategory(currentIdx, taskInputs[currentIdx]);
  };

  return (
    <div className={styles.inputBtnContainer}>
      <div className={styles.inputBtn}>
        <span
          className={styles.inputToggleIcon}
          onClick={() => toggleTaskInput(categoryIndex)}
          tabIndex={0}
          role="button"
          aria-label="タスク入力欄の表示切替"
          style={{ marginTop: "0.5rem" }}
        >
          {showTaskInput[categoryIndex] ? "−" : "+"}
        </span>
      </div>
      <div>
        {showTaskInput[categoryIndex] && (
          <div className={styles.memoInputStyle}>
            <input
              className={styles.memoInput}
              placeholder="input task"
              value={taskInputs[currentIdx] || ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.addBtn} onClick={handleAddClick}>
              add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskInput;
