// Animation utilities for consistent transitions
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

export const ANIMATION_EASINGS = {
  easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Staggered animation delays for list items
export const getStaggerDelay = (index: number, baseDelay = 50) => {
  return index * baseDelay;
};

// Touch feedback animations
export const TOUCH_FEEDBACK = {
  scale: 'scale-95',
  duration: 'duration-100',
  ease: 'ease-out',
} as const;

// Loading animation variants
export const LOADING_VARIANTS = {
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  fadeIn: 'animate-fade-in',
} as const;

// Mobile-specific animation classes
export const MOBILE_ANIMATIONS = {
  swipeReveal: 'transition-transform duration-200 ease-out',
  pullToRefresh: 'transition-all duration-300 ease-out', 
  touchScale: 'active:scale-95 transition-transform duration-100',
  cardHover: 'hover:shadow-lg transition-shadow duration-200',
} as const;