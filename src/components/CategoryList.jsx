import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableCategory from "./SortableCategory";
import SortableTask from "./SortableTask";
import TaskInput from "./TaskInput";
import styles from "../App.module.scss";

function CategoryList({
  categories,
  isMobile,
  mobileCategoryIndex,
  deleteCategory,
  toggleCategoryCollapse,
  toggleTaskDone,
  deleteTask,
  isTaskInputVisible,
  handleToggleTaskInput,
  taskInputs,
  handleTaskInputChange,
  handleTaskKeyDown,
  handleTaskAddClick,
}) {
  return (
    <SortableContext items={categories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
      {categories.map((categoryItem, categoryIndex) => {
        if (isMobile && categoryIndex !== mobileCategoryIndex) return null;
        if (categoryItem.collapsed) return null;
        return (
          <SortableCategory
            key={categoryItem.id}
            id={categoryItem.id}
            label={categoryItem.category}
            onDelete={() => {
              if (window.confirm("本当にこのカテゴリを削除しますか？")) {
                deleteCategory(categoryIndex);
              }
            }}
            onCollapse={() => toggleCategoryCollapse(categoryItem.id)}
          >
            <div className={styles.categoryContainer}>
              <div>
                <SortableContext
                  items={categoryItem.tasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {categoryItem.tasks.map((taskItem) => (
                    <SortableTask
                      key={taskItem.id}
                      id={taskItem.id}
                      text={taskItem.text}
                      done={taskItem.done}
                      onToggle={() => toggleTaskDone(categoryIndex, taskItem.id)}
                      onDelete={() => deleteTask(categoryIndex, taskItem.id)}
                    />
                  ))}
                </SortableContext>
                <TaskInput
                  categoryIndex={categoryIndex}
                  mobileCategoryIndex={mobileCategoryIndex}
                  isMobile={isMobile}
                  isTaskInputVisible={isTaskInputVisible}
                  onToggleTaskInput={handleToggleTaskInput}
                  taskInputs={taskInputs}
                  onInputChange={handleTaskInputChange}
                  onKeyDown={handleTaskKeyDown}
                  onAddClick={handleTaskAddClick}
                />
              </div>
            </div>
          </SortableCategory>
        );
      })}
    </SortableContext>
  );
}

export default CategoryList;
