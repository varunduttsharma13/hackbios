/**
 * MED-BRIDGE Motion System
 * Refined, purposeful animations with 3 interaction tiers:
 * 1. Microinteractions (120-160ms)
 * 2. Interface Transitions & Drawers (200-240ms)
 * 3. Workflow Feedback & Scan Progress (240-300ms)
 * Supports accessible prefers-reduced-motion.
 */

export const TRANSITION_EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const TRANSITION_EASE_IN = [0.7, 0, 0.84, 0] as const;
export const TRANSITION_SHARP = [0.4, 0, 0.2, 1] as const;

export const MOTION_DURATIONS = {
  micro: 0.14,
  button: 0.16,
  card: 0.2,
  dialog: 0.24,
  page: 0.22,
};

// Framer Motion Page Transition Variants
export const pageMotionVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATIONS.page, ease: TRANSITION_EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.14, ease: TRANSITION_EASE_IN },
  },
};

// Modal / Dialog Drawer Variants
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.14, ease: 'easeIn' } },
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: MOTION_DURATIONS.dialog, ease: TRANSITION_EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: { duration: 0.16, ease: TRANSITION_EASE_IN },
  },
};

// Bottom Sheet Variants (Mobile drawer)
export const sheetVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { duration: MOTION_DURATIONS.dialog, ease: TRANSITION_EASE_OUT },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.18, ease: TRANSITION_EASE_IN },
  },
};

// Staggered Container for Lists / Grids
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: TRANSITION_EASE_OUT },
  },
};

// Button Tap / Press Feedback
export const buttonPressProps = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { duration: MOTION_DURATIONS.button },
};
