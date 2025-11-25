import { DndContext, DragOverlay, pointerWithin, TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import styles from "./App.module.scss";
import SortableTask from "./SortableTask";
import { useMemos } from "./useMemos";
import SortableCategory from "./SortableCategory";
import React from "react";

function App() {
  // カスタムフックから全ての状態・操作関数を取得
  const {
    text,
    setText,
    taskInputs,
    setTaskInputs,
    memos,
    addCategory,
    addTaskToCategory,
    toogleTaskDone,
    deleteTask,
    deleteMemo,
    showTaskInput,
    toggleTaskInput,
    isAltColor,
    setIsAltColor,
    activeTask,
    activeCategory,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    collapsedCategories,
    toggleCategoryCollapse,
    showSidebar,
    setShowSidebar,
    isMobile,
    mobileCategoryIndex,
    handlePrevCategory,
    handleNextCategory,
  } = useMemos();

  // DnD Kitのセンサー設定（マウス・タッチ対応）
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // テーマ切り替え（bodyのクラスを変更）
  React.useEffect(() => {
    document.body.classList.remove(styles.themeA, styles.themeB);
    document.body.classList.add(isAltColor ? styles.themeB : styles.themeA);
  }, [isAltColor]);

  return (
    // テーマとレイアウトのコンテナ
    <div className={`${isAltColor ? styles.themeB : styles.themeA} ${styles.container}`}>
      {/* ヘッダー部 */}
      <div className={styles.header}>
        <div className={styles.title}>Todo List</div>
        <div className={styles.headerContainer}>
          {/* テーマ切り替えトグル */}
          <div className={styles.toggleContainer}>
            <div>Theme Color</div>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={isAltColor}
                onChange={() => setIsAltColor((prev) => !prev)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          {/* サイドバー表示トグル */}
          <div className={styles.toggleContainer}>
            <div>Memo Box</div>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={showSidebar}
                onChange={() => setShowSidebar((prev) => !prev)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
      <br />
      <div className={styles.body}>
        {/* サイドバー（折り畳み中カテゴリー一覧と追加UI） */}
        {showSidebar && (
          <div className={styles.sidebar}>
            <div className={styles.categoryInputStyle}>
              <input
                className={styles.categoryInput}
                placeholder=" input category here"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addCategory()}
              />
              <button
                className={styles.categoryAddBtn}
                onClick={addCategory}
              >
                add
              </button>
            </div>
            {/* 折り畳み中カテゴリーの一覧表示 */}
            {memos
              .filter(cat => collapsedCategories.includes(cat.id))
              .map(cat => (
                <div
                  key={cat.id}
                  className={styles.sidebarCategory}
                  onClick={() => toggleCategoryCollapse(cat.id)}
                >
                  {cat.category}
                </div>
              ))}
          </div>
        )}

        {/* メイン画面（カテゴリー・タスク一覧） */}
        <div className={styles.mainContainer}>
          {/* モバイル時のみカテゴリー切り替えボタン（左） */}
          {isMobile && memos.length > 1 && !showSidebar && (
            <div className={styles.categorySwitchArrows}>
              <button
                className={styles.categoryArrowBtn}
                onClick={handlePrevCategory}
                aria-label="前のカテゴリー"
              >
                ←
              </button>
            </div>
          )}
          <div className={styles.category}>
            {/* DnD Kitのドラッグ＆ドロップコンテキスト */}
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              {/* カテゴリーの並び替えコンテキスト */}
              <SortableContext
                items={memos.map(cat => cat.id)}
                strategy={verticalListSortingStrategy}
              >
                {/* 折り畳み中以外のカテゴリーを表示 */}
                {memos
                  .filter((_, idx) =>
                    !isMobile
                      || (!showSidebar && idx === mobileCategoryIndex)
                      || (!showSidebar && !isMobile)
                  )
                  .map((categoryItem, categoryIndex) =>
                    !collapsedCategories.includes(categoryItem.id) && (
                      <SortableCategory
                        key={categoryItem.id}
                        id={categoryItem.id}
                        label={categoryItem.category}
                        onDelete={() => {
                          if (window.confirm("本当にこのカテゴリを削除しますか？")) {
                            deleteMemo(categoryIndex);
                          }
                        }}
                        onCollapse={() => toggleCategoryCollapse(categoryItem.id)}
                      >
                        <div className={styles.categoryContainer}>
                          <div>
                            {/* タスクの並び替えコンテキスト */}
                            <SortableContext
                              items={categoryItem.tasks.map(task => task.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {/* タスク一覧表示（未完了→完了順） */}
                              {categoryItem.tasks
                                .slice()
                                .sort((a, b) => a.done - b.done)
                                .map((taskItem) => (
                                  <SortableTask
                                    key={taskItem.id}
                                    id={taskItem.id}
                                    text={taskItem.text}
                                    done={taskItem.done}
                                    onToggle={() => toogleTaskDone(categoryIndex, taskItem.id)}
                                    onDelete={() => deleteTask(categoryIndex, taskItem.id)}
                                  />
                                ))}
                            </SortableContext>
                            {/* タスク追加UI */}
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
                                      value={
                                        isMobile
                                          ? taskInputs[mobileCategoryIndex] || ""
                                          : taskInputs[categoryIndex] || ""
                                      }
                                      onChange={e => {
                                        // モバイル時はmobileCategoryIndex、PC時はcategoryIndexで入力値を管理
                                        const idx = isMobile ? mobileCategoryIndex : categoryIndex;
                                        const newInputs = [...taskInputs];
                                        newInputs[idx] = e.target.value;
                                        setTaskInputs(newInputs);
                                      }}
                                      onKeyDown={e => {
                                        if (e.key === "Enter") {
                                          const idx = isMobile ? mobileCategoryIndex : categoryIndex;
                                          addTaskToCategory(idx, taskInputs[idx]);
                                        }
                                      }}
                                    />
                                    <button
                                      className={styles.addBtn}
                                      onClick={() => {
                                        const idx = isMobile ? mobileCategoryIndex : categoryIndex;
                                        addTaskToCategory(idx, taskInputs[idx]);
                                      }}
                                    >
                                      add
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SortableCategory>
                    ))
                }
              </SortableContext>
              {/* ドラッグ中のオーバーレイ表示（ドラッグ状態に依存） */}
              <DragOverlay>
                {activeTask ? (
                  <SortableTask
                    id={activeTask.id}
                    text={activeTask.text}
                    done={activeTask.done}
                    onToggle={() => {}}
                    onDelete={() => {}}
                    isOverlay={true}
                  />
                ) : activeCategory ? (
                  <SortableCategory
                    id={activeCategory.id}
                    label={activeCategory.label}
                    isOverlay={true}
                  >
                    <div className={`${styles.categoryContainer} ${styles.categoryContainerOverlay}`}>
                      {activeCategory.tasks?.map((taskItem) => (
                        <SortableTask
                          key={taskItem.id}
                          id={taskItem.id}
                          text={taskItem.text}
                          done={taskItem.done}
                          onToggle={() => {}}
                          onDelete={() => {}}
                          isParentOverlay={true}
                        />
                      ))}
                    </div>
                  </SortableCategory>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
          {/* モバイル時のみカテゴリー切り替えボタン（右） */}
          {isMobile && memos.length > 1 && !showSidebar && (
            <div className={styles.categorySwitchArrows}>
              <button
                className={styles.categoryArrowBtn}
                onClick={handleNextCategory}
                aria-label="次のカテゴリー"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
