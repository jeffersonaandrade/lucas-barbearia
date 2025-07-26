import { Suspense, memo } from 'react';
import LoadingSpinner from './loading-spinner.jsx';

const SuspenseWrapper = memo(({ children, fallback, className = "py-16" }) => {
  const defaultFallback = (
    <div className={`flex justify-center items-center ${className}`}>
      <LoadingSpinner size="lg" text="Carregando..." />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
});

SuspenseWrapper.displayName = 'SuspenseWrapper';

export { SuspenseWrapper }; 