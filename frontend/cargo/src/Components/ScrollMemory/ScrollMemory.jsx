import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {}; // store scroll positions per path

const ScrollMemory = () => {
  const { pathname } = useLocation();
  const isRestoring = useRef(false);

  // Save scroll position before leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions[pathname] = window.scrollY;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      scrollPositions[pathname] = window.scrollY;
    };
  }, [pathname]);

  // Restore scroll position on page load
  useEffect(() => {
    const pos = scrollPositions[pathname] || 0;
    isRestoring.current = true;
    window.scrollTo({ top: pos, behavior: "smooth" });
    const timer = setTimeout(() => (isRestoring.current = false), 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollMemory;
