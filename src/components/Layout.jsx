import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useScrollY } from '../hooks/useScrollY';
import { lerpHexColor } from '../hooks/lerpHexColor';
import { useTheme } from '../context/ThemeContext';

const THEME_SCROLL_COLORS = {
  dark: { start: '#0a0e1c', end: '#000000' },
  light: { start: '#eef3fa', end: '#d9e7f7' },
};

export default function Layout() {
  const scrollY = useScrollY();
  const { theme } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;
  const progress = Math.min(scrollY / (viewportH * 0.9), 1);
  const { start, end } = THEME_SCROLL_COLORS[theme];
  const bgColor = lerpHexColor(start, end, progress);

  return (
    <div
      className="min-h-screen text-(--text-primary) transition-colors duration-150 ease-linear"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />
      <main key={pathname} className="page-transition">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
