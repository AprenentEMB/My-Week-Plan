


export const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.3, // espera abans d’animar els fills
        staggerChildren: 0.2, // interval entre elements
      },
    },
  };


  export const itemVariants = {
    hidden: { opacity: 0, x: -10, scale: 0.95 }, // comença fora de la pantalla a l’esquerra
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.9, ease: 'easeOut' },
    }
  };
