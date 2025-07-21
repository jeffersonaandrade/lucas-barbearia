import { useCallback } from 'react';

export const useScroll = () => {
  const scrollToSection = useCallback((href, closeMenu = null) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    if (closeMenu) {
      closeMenu();
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return {
    scrollToSection,
    scrollToTop
  };
}; 