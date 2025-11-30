import { DndContext, DragOverlay, pointerWithin, TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import styles from "./App.module.scss";
import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileNavigation from "./components/MobileNavigation";
import CategoryList from "./components/CategoryList";
import SortableCategory from "./components/SortableCategory";
import SortableTask from "./components/SortableTask";
import { useTheme } from "./hooks/useTheme";
import { useCategoryManagement } from "./hooks/useCategoryManagement";
import { useTaskManagement } from "./hooks/useTaskManagement";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useMobileView } from "./hooks/useMobileView";

function App() {
  const { isAltColor, setIsAltColor } = useTheme();
  const {
    text,
    setText,
    memos,
    setMemos,
    addCategory,
    deleteCategory,
    toggleCategoryCollapse,
    showSidebar,
    setShowSidebar,
  } = useCategoryManagement();

  const {
    taskInputs,
    showTaskInput,
    toggleTaskInput,
    toggleTaskDone,
    deleteTask,
    handleTaskInputChange,
    handleTaskKeyDown,
    handleTaskAddClick,
  } = useTaskManagement(memos, setMemos);

  const { activeTask, activeCategory, handleDragStart, handleDragEnd, handleDragCancel } =
    useDragAndDrop(memos, setMemos);

  const { isMobile, mobileCategoryIndex, handlePrevCategory, handleNextCategory } = useMobileView(
    memos
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <div className={`${isAltColor ? styles.themeB : styles.themeA} ${styles.container}`}>
      <Header
        isAltColor={isAltColor}
        setIsAltColor={setIsAltColor}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <br />
      <div className={styles.body}>
        {showSidebar && (
          <Sidebar
            text={text}
            setText={setText}
            addCategory={addCategory}
            memos={memos}
            toggleCategoryCollapse={toggleCategoryCollapse}
          />
        )}

        <div className={styles.mainContainer}>
          {isMobile && memos.length > 1 && !showSidebar && (
            <MobileNavigation direction="prev" onClick={handlePrevCategory} />
          )}

          <div className={styles.category}>
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <CategoryList
                memos={memos}
                isMobile={isMobile}
                mobileCategoryIndex={mobileCategoryIndex}
                showSidebar={showSidebar}
                deleteCategory={deleteCategory}
                toggleCategoryCollapse={toggleCategoryCollapse}
                toggleTaskDone={toggleTaskDone}
                deleteTask={deleteTask}
                showTaskInput={showTaskInput}
                toggleTaskInput={toggleTaskInput}
                taskInputs={taskInputs}
                handleTaskInputChange={handleTaskInputChange}
                handleTaskKeyDown={handleTaskKeyDown}
                handleTaskAddClick={handleTaskAddClick}
              />

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

          {isMobile && memos.length > 1 && !showSidebar && (
            <MobileNavigation direction="next" onClick={handleNextCategory} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
