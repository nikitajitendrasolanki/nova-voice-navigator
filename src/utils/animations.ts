
export const staggerChildren = (delay = 0.1) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
    },
  },
});

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const getStaggerDelay = (index: number, baseDelay = 100) => {
  return index * baseDelay;
};
