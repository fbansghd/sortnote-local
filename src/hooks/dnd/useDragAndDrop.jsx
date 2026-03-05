import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export function useDragAndDrop(categories, setCategories) {
  const [activeTask, setActiveTask] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const resetActiveItems = () => {
    setActiveTask(null);
    setActiveCategory(null);
  };

  const moveCategory = (activeCategoryIndex, overCategoryIndex) => {
    const newCategories = arrayMove(categories, activeCategoryIndex, overCategoryIndex);
    setCategories(newCategories);
  };

  const moveTaskWithinCategory = (categoryIndex, activeId, overId) => {
    const oldIndex = categories[categoryIndex].tasks.findIndex((t) => t.id === activeId);
    const newIndex = categories[categoryIndex].tasks.findIndex((t) => t.id === overId);
    const newCategories = [...categories];
    newCategories[categoryIndex] = {
      ...newCategories[categoryIndex],
      tasks: arrayMove(categories[categoryIndex].tasks, oldIndex, newIndex),
    };
    setCategories(newCategories);
  };

  const moveTaskBetweenCategories = (fromCategoryIndex, toCategoryIndex, taskId, overIndex) => {
    const task = categories[fromCategoryIndex].tasks.find((task) => task.id === taskId);
    if (!task) {
      setActiveTask(null);
      return;
    }

    const newFromTasks = categories[fromCategoryIndex].tasks.filter((t) => t.id !== taskId);
    const newToTasks = [
      ...categories[toCategoryIndex].tasks.slice(0, overIndex),
      task,
      ...categories[toCategoryIndex].tasks.slice(overIndex),
    ];

    const newCategories = categories.map((cat, idx) => {
      if (idx === fromCategoryIndex) return { ...cat, tasks: newFromTasks };
      if (idx === toCategoryIndex) return { ...cat, tasks: newToTasks };
      return cat;
    });

    setCategories(newCategories);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = categories.flatMap((cat) => cat.tasks).find((task) => task.id === active.id);
    setActiveTask(task);

    const category = categories.find((cat) => cat.id === active.id);
    if (category) {
      setActiveCategory({
        id: category.id,
        label: category.category,
        tasks: category.tasks,
      });
    } else {
      setActiveCategory(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      resetActiveItems();
      return;
    }

    // カテゴリの並び替え
    const activeCategoryIndex = categories.findIndex((cat) => cat.id === active.id);
    const overCategoryIndex = categories.findIndex((cat) => cat.id === over.id);

    if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
      moveCategory(activeCategoryIndex, overCategoryIndex);
      resetActiveItems();
      return;
    }

    // タスクの移動
    const fromCategoryIndex = categories.findIndex((cat) =>
      cat.tasks.some((task) => task.id === active.id)
    );
    if (fromCategoryIndex === -1) {
      setActiveTask(null);
      return;
    }

    let toCategoryIndex = categories.findIndex((cat) =>
      cat.tasks.some((task) => task.id === over.id)
    );
    let overIndex = -1;

    if (toCategoryIndex !== -1) {
      overIndex = categories[toCategoryIndex].tasks.findIndex((t) => t.id === over.id);
    } else {
      toCategoryIndex = categories.findIndex((cat) => cat.id === over.id);
      overIndex = categories[toCategoryIndex]?.tasks.length ?? -1;
      if (toCategoryIndex === -1) {
        setActiveTask(null);
        return;
      }
    }

    // 同じカテゴリ内での移動
    if (fromCategoryIndex === toCategoryIndex) {
      moveTaskWithinCategory(fromCategoryIndex, active.id, over.id);
      resetActiveItems();
      return;
    }

    // 異なるカテゴリ間での移動
    moveTaskBetweenCategories(fromCategoryIndex, toCategoryIndex, active.id, overIndex);
    resetActiveItems();
  };

  const handleDragCancel = () => {
    resetActiveItems();
  };

  return {
    activeTask,
    activeCategory,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
