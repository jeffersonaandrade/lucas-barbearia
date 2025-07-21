import { useCallback } from 'react';
import { useIntersectionObserver } from './use-intersection-observer.js';

export const useAnimations = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const getAnimationClasses = useCallback((delay = 0) => {
    return {
      elementRef,
      className: `transition-all duration-700 ${delay ? `delay-${delay}` : ''} ${
        hasIntersected 
          ? 'animate-fade-in opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`
    };
  }, [hasIntersected, elementRef]);

  const getStaggeredAnimation = useCallback((index, baseDelay = 100) => {
    return {
      elementRef,
      className: `transition-all duration-700 delay-${index * baseDelay} ${
        hasIntersected 
          ? 'animate-fade-in opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`
    };
  }, [hasIntersected, elementRef]);

  return {
    elementRef,
    hasIntersected,
    getAnimationClasses,
    getStaggeredAnimation
  };
}; 