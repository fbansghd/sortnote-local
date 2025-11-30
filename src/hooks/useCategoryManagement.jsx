import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./useLocalStorage";

export function useCategoryManagement() {
  const [text, setText] = useState("");
  const [categories, setCategories] = useLocalStorage("memos", []);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // マイグレーション処理: 既存データに collapsed プロパティがなければ追加
  useEffect(() => {
    const needsMigration = categories.some((category) => category.collapsed === undefined);
    if (needsMigration) {
      setCategories((categories) =>
        categories.map((category) => ({
          ...category,
          collapsed: category.collapsed ?? false, // デフォルトは展開
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCategory = () => {
    if (!text) return;
    setCategories([...categories, { id: uuidv4(), category: text, tasks: [], collapsed: false }]);
    setText("");
  };

  const deleteCategory = (catIdx) => {
    setCategories((categories) => categories.filter((_, i) => i !== catIdx));
  };

  const toggleCategoryCollapse = (categoryId) => {
    setCategories((categories) =>
      categories.map((category) =>
        category.id === categoryId ? { ...category, collapsed: !category.collapsed } : category
      )
    );
  };

  return {
    text,
    setText,
    categories,
    setCategories,
    addCategory,
    deleteCategory,
    toggleCategoryCollapse,
    isSidebarVisible,
    setIsSidebarVisible,
  };
}
