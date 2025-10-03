import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

export function useMemos() {
  // カテゴリー追加用テキスト
  const [text, setText] = useState("");
  // 各カテゴリーごとのタスク入力欄の値
  const [taskInputs, setTaskInputs] = useState([]);
  // 全カテゴリーとタスクのデータ
  const [memos, setMemos] = useState(() => {
    const saved = localStorage.getItem("memos");
    return saved ? JSON.parse(saved) : [];
  });

  // ドラッグ中のタスク情報
  const [activeTask, setActiveTask] = useState(null);
  // ドラッグ中のカテゴリー情報
  const [activeCategory, setActiveCategory] = useState(null);

  // サイドバー表示状態
  const [showSidebar, setShowSidebar] = useState(false);

  // モバイル判定（画面幅600px以下）
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    // 画面サイズ変更時にモバイル判定を更新
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // モバイル用：表示中カテゴリーのインデックス
  const [mobileCategoryIndex, setMobileCategoryIndex] = useState(0);

  // 折り畳み中カテゴリーIDリスト
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    const saved = localStorage.getItem("collapsedCategories");
    return saved ? JSON.parse(saved) : [];
  });

  // 折り畳み状態をローカル保存
  useEffect(() => {
    localStorage.setItem("collapsedCategories", JSON.stringify(collapsedCategories));
  }, [collapsedCategories]);

  // カテゴリーの折り畳み/展開切り替え
  const toggleCategoryCollapse = (categoryId) => {
    setCollapsedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 折り畳まれていないカテゴリーのインデックス一覧取得
  const getOpenCategoryIndexes = () =>
    memos
      .map((cat, idx) => (!collapsedCategories.includes(cat.id) ? idx : null))
      .filter(idx => idx !== null);

  // モバイル用：前のカテゴリーへ切り替え
  const handlePrevCategory = () => {
    const openIndexes = getOpenCategoryIndexes();
    if (openIndexes.length === 0) return;
    const currentIdx = openIndexes.indexOf(mobileCategoryIndex);
    const prevIdx = (currentIdx - 1 + openIndexes.length) % openIndexes.length;
    setMobileCategoryIndex(openIndexes[prevIdx]);
  };

  // モバイル用：次のカテゴリーへ切り替え
  const handleNextCategory = () => {
    const openIndexes = getOpenCategoryIndexes();
    if (openIndexes.length === 0) return;
    const currentIdx = openIndexes.indexOf(mobileCategoryIndex);
    const nextIdx = (currentIdx + 1) % openIndexes.length;
    setMobileCategoryIndex(openIndexes[nextIdx]);
  };

  // 初回のみ：localStorageからmemosを復元
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // memosが変わるたびにlocalStorageへ保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  // カテゴリー追加
  const addCategory = () => {
    if (!text) return;
    setMemos([...memos, { id: uuidv4(), category: text, tasks: [] }]);
    setText("");
    setTaskInputs([...taskInputs, ""]);
  };

  // タスク配列を未完了→完了順にソート
  const sortTasks = (tasks) => {
    return tasks.slice().sort((a, b) => a.done - b.done);
  };

  // タスク追加
  const addTaskToCategory = (catIdx, task) => {
    if (!task) return;
    setMemos((prev) => {
      const newMemos = [...prev];
      const tasks = [...newMemos[catIdx].tasks, { id: uuidv4(), text: task, done: false }];
      newMemos[catIdx].tasks = sortTasks(tasks);
      return newMemos;
    });
    const newInputs = [...taskInputs];
    newInputs[catIdx] = "";
    setTaskInputs(newInputs);
  };

  // タスク完了状態の切り替え
  const toogleTaskDone = (catIdx, taskId) => {
    setMemos((prev) => {
      const newMemos = [...prev];
      const tasks = newMemos[catIdx].tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      );
      newMemos[catIdx].tasks = sortTasks(tasks);
      return newMemos;
    });
  };

  // タスク削除
  const deleteTask = (catIdx, taskId) => {
    setMemos((prev) => {
      const newMemos = [...prev];
      const tasks = newMemos[catIdx].tasks.filter((task) => task.id !== taskId);
      newMemos[catIdx].tasks = sortTasks(tasks);
      return newMemos;
    });
  };

  // カテゴリー削除
  const deleteMemo = (catIdx) => {
    setMemos((memos) => memos.filter((_, i) => i !== catIdx));
    setTaskInputs((inputs) => inputs.filter((_, i) => i !== catIdx));
  };

  // DnD Kit: ドラッグ開始時の処理
  const handleDragStart = (event) => {
    const { active } = event;
    // タスクのドラッグ
    const task = memos
      .flatMap((cat) => cat.tasks)
      .find((task) => task.id === active.id);
    setActiveTask(task);

    // カテゴリーのドラッグ
    const category = memos.find((cat) => cat.id === active.id);
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

  // DnD Kit: ドラッグ終了時の処理
  const handleDragEnd = (event) => {
    const { active, over } = event;
    // ドラッグ先がない or 同じ場所ならリセット
    if (!over || active.id === over.id) {
      setActiveTask(null);
      // 非同期でactiveCategoryをリセット（連続ドラッグ対策）
      setTimeout(() => setActiveCategory(null), 0);
      return;
    }

    // カテゴリーの並び替え
    const activeCategoryIndex = memos.findIndex((cat) => cat.id === active.id);
    const overCategoryIndex = memos.findIndex((cat) => cat.id === over.id);
    if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
      const newMemos = arrayMove(memos, activeCategoryIndex, overCategoryIndex);
      setMemos(newMemos);
      localStorage.setItem("memos", JSON.stringify(newMemos));
      setActiveTask(null);
      setTimeout(() => setActiveCategory(null), 0); // ← 非同期リセット
      return;
    }

    // タスクの並び替え（同じカテゴリー内）
    const fromCategoryIndex = memos.findIndex((cat) =>
      cat.tasks.some((task) => task.id === active.id)
    );
    if (fromCategoryIndex === -1) {
      setActiveTask(null);
      return;
    }

    let toCategoryIndex = memos.findIndex((cat) =>
      cat.tasks.some((task) => task.id === over.id)
    );
    let overIndex = -1;

    if (toCategoryIndex !== -1) {
      overIndex = memos[toCategoryIndex].tasks.findIndex((t) => t.id === over.id);
    } else {
      // タスクをカテゴリーの末尾に移動
      toCategoryIndex = memos.findIndex((cat) => cat.id === over.id);
      overIndex = memos[toCategoryIndex]?.tasks.length ?? -1;
      if (toCategoryIndex === -1) {
        setActiveTask(null);
        return;
      }
    }

    if (fromCategoryIndex === toCategoryIndex) {
      // 同じカテゴリー内でタスクの並び替え
      const oldIndex = memos[fromCategoryIndex].tasks.findIndex((t) => t.id === active.id);
      const newIndex = overIndex;
      const newMemos = [...memos];
      newMemos[fromCategoryIndex] = {
        ...newMemos[fromCategoryIndex],
        tasks: arrayMove(memos[fromCategoryIndex].tasks, oldIndex, newIndex),
      };
      setMemos(newMemos);
      localStorage.setItem("memos", JSON.stringify(newMemos));
      setActiveTask(null);
      setTimeout(() => setActiveCategory(null), 0); // ← 非同期リセット
      return;
    }

    // タスクを別カテゴリーへ移動
    const task = memos[fromCategoryIndex].tasks.find((task) => task.id === active.id);
    if (!task) {
      setActiveTask(null);
      return;
    }
    const newFromTasks = memos[fromCategoryIndex].tasks.filter((t) => t.id !== active.id);
    const newToTasks = [
      ...memos[toCategoryIndex].tasks.slice(0, overIndex),
      task,
      ...memos[toCategoryIndex].tasks.slice(overIndex),
    ];

    const newMemos = memos.map((cat, idx) => {
      if (idx === fromCategoryIndex) {
        return { ...cat, tasks: newFromTasks };
      }
      if (idx === toCategoryIndex) {
        return { ...cat, tasks: newToTasks };
      }
      return cat;
    });

    setMemos(newMemos);
    setActiveTask(null);
    setTimeout(() => setActiveCategory(null), 0); // ← 非同期リセット
  };

  // DnD Kit: ドラッグキャンセル時の処理
  const handleDragCancel = () => {
    setActiveTask(null);
    setTimeout(() => setActiveCategory(null), 0); // ← 非同期リセット
  };

  // 各カテゴリーごとのタスク入力欄表示状態
  const [showTaskInput, setShowTaskInput] = useState({});
  // タスク入力欄の表示/非表示切り替え
  const toggleTaskInput = (categoryIndex) => {
    setShowTaskInput((prev) => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex],
    }));
  };

  // テーマカラー切り替え状態（ローカル保存付き）
  const [isAltColor, setIsAltColor] = useState(() => {
    const saved = localStorage.getItem("isAltColor");
    return saved ? JSON.parse(saved) : false;
  });
  useEffect(() => {
    localStorage.setItem("isAltColor", JSON.stringify(isAltColor));
  }, [isAltColor]);

  // すべての状態・関数を返す
  return {
    text,
    setText,
    taskInputs,
    setTaskInputs,
    memos,
    setMemos,
    addCategory,
    addTaskToCategory,
    toogleTaskDone,
    deleteTask,
    deleteMemo,
    showTaskInput,
    setShowTaskInput,
    toggleTaskInput,
    isAltColor,
    setIsAltColor,
    activeTask,
    setActiveTask,
    activeCategory,
    setActiveCategory,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    collapsedCategories,
    setCollapsedCategories,
    toggleCategoryCollapse,
    showSidebar,
    setShowSidebar,
    isMobile,
    setIsMobile,
    mobileCategoryIndex,
    setMobileCategoryIndex,
    getOpenCategoryIndexes,
    handlePrevCategory,
    handleNextCategory,
  };
}