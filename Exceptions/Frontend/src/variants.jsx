
const screenWidth = window.innerWidth;
let xOffset = 100;
if (screenWidth >= 1200) {
  xOffset = 100;
} else if(screenWidth >= 960) {
  xOffset = 80;
} else if(screenWidth >= 768) {
  xOffset = 25;
} else if(screenWidth >= 640) {
  xOffset = 15;
} else {
  xOffset = 10;
}

export const fadeIn = (direction, delay) => {
  return {
    hidden: {
      y: direction === 'up' ? 60 : direction === 'down' ? -100 : 0,
      x: direction === 'right' ? xOffset: direction === 'left' ? -xOffset : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: delay,
      }
    }
  }
}


export const scaleIn = (delay) => {
  return {
    hidden: {
      opacity: 1,
      scale: 0,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
      }
    }
  }
}


export const cardVariants = (delay, index) => ({
  hidden: () => {
    const rowIndex = Math.floor(index / 3);
    const xValue = rowIndex % 2 === 0 ? -xOffset : xOffset;
    return { x: xValue, opacity: 0 };
  },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: (index % 3) * delay}
  }
});
