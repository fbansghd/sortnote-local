import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useTaskManagement(categories, setCategories) {
  const [taskInputs, setTaskInputs] = useState({});
  const [isTaskInputVisible, setIsTaskInputVisible] = useState({});

  const sortTasks = (tasks) => tasks.slice().sort((a, b) => a.done - b.done);

  const addTaskToCategory = (catId, task) => {
    if (!task) return;
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, tasks: sortTasks([...cat.tasks, { id: uuidv4(), text: task, done: false }]) };
      })
    );
    setTaskInputs((prev) => ({ ...prev, [catId]: "" }));
  };

  const toggleTaskDone = (catId, taskId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          tasks: sortTasks(cat.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task)),
        };
      })
    );
  };

  const deleteTask = (catId, taskId) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, tasks: sortTasks(cat.tasks.filter((task) => task.id !== taskId)) };
      })
    );
  };

  const handleToggleTaskInput = (categoryId) => {
    setIsTaskInputVisible((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleTaskInputChange = (catId, value) => {
    setTaskInputs((prev) => ({ ...prev, [catId]: value }));
  };

  const handleTaskKeyDown = (catId, e, isComposing) => {
    if (e.key === "Enter" && !isComposing) {
      addTaskToCategory(catId, taskInputs[catId]);
    }
  };

  const handleTaskAddClick = (catId) => {
    addTaskToCategory(catId, taskInputs[catId]);
  };

  return {
    taskInputs,
    setTaskInputs,
    isTaskInputVisible,
    handleToggleTaskInput,
    addTaskToCategory,
    toggleTaskDone,
    deleteTask,
    handleTaskInputChange,
    handleTaskKeyDown,
    handleTaskAddClick,
  };
}
