// Classes CSS comuns
export const CSS_CLASSES = {
  // Layout
  container: 'container mx-auto',
  sectionPadding: 'section-padding',
  grid: {
    twoCols: 'grid lg:grid-cols-2 gap-8 lg:gap-12',
    threeCols: 'grid md:grid-cols-3 gap-6',
    fourCols: 'grid sm:grid-cols-2 lg:grid-cols-4 gap-6'
  },
  
  // Spacing
  spacing: {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  },
  
  // Flexbox
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    row: 'flex flex-row'
  },
  
  // Text
  text: {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
    primary: 'text-primary',
    muted: 'text-muted-foreground',
    body: 'text-body',
    heading: 'heading-primary',
    headingSecondary: 'heading-secondary'
  },
  
  // Buttons
  button: {
    primary: 'gradient-primary text-white hover:opacity-90 transition-opacity',
    outline: 'border-primary text-primary hover:bg-primary hover:text-white',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-2xl border border-border',
    hover: 'hover:shadow-md transition-shadow',
    interactive: 'cursor-pointer hover:shadow-md transition-shadow'
  },
  
  // Animations
  animation: {
    fadeIn: 'animate-fade-in',
    transition: 'transition-all duration-300',
    transitionSlow: 'transition-all duration-700'
  }
};

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Z-index layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080
};

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700
};

// Common messages
export const MESSAGES = {
  loading: 'Carregando...',
  error: 'Ocorreu um erro. Tente novamente.',
  success: 'Operação realizada com sucesso!',
  noData: 'Nenhum dado encontrado.'
}; 