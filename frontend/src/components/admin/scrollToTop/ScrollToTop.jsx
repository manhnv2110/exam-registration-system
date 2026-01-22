// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // chạy lại mỗi khi đổi đường dẫn

  return null; // không render gì ra giao diện
};

export default ScrollToTop;
