import { useState, useEffect } from "react";
import { MOBILE_BREAKPOINT } from "../constants";

export function useMobileView(categories) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [mobileCategoryIndex, setMobileCategoryIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getOpenCategoryIndexes = () =>
    categories
      .map((cat, idx) => (!cat.collapsed ? idx : null))
      .filter((idx) => idx !== null);

  const handlePrevCategory = () => {
    const openIndexes = getOpenCategoryIndexes();
    if (openIndexes.length === 0) return;
    const currentIdx = openIndexes.indexOf(mobileCategoryIndex);
    const prevIdx = (currentIdx - 1 + openIndexes.length) % openIndexes.length;
    setMobileCategoryIndex(openIndexes[prevIdx]);
  };

  const handleNextCategory = () => {
    const openIndexes = getOpenCategoryIndexes();
    if (openIndexes.length === 0) return;
    const currentIdx = openIndexes.indexOf(mobileCategoryIndex);
    const nextIdx = (currentIdx + 1) % openIndexes.length;
    setMobileCategoryIndex(openIndexes[nextIdx]);
  };

  return {
    isMobile,
    mobileCategoryIndex,
    handlePrevCategory,
    handleNextCategory,
  };
}
