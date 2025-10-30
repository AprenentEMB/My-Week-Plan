import { PlanejadorSetmanal } from './components/PlanejadorSetmanal';
import { Eines } from './components/Eines';
import { usePlanejadorStore } from './stores/store';
import { useEinesStore } from './stores/storeEines';
import { FormulariActivitat } from './components/Formulari';
import { ExportaPDFButton } from './components/ExportaPDFButton';
import { useEffect, useState } from 'react';
import { CursorFlotant } from './components/CursorFlotant';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { containerVariants, itemVariants } from './const/animations';
import { LanguageSelector } from './components/LanguageSelector';

function App() {
  const {
    colorEscollitTemporal,
    setGeneralBackgroundColor,
    generalBackgroundColor,
    setColorEscollitTemporal,
    fontFamily,
  } = usePlanejadorStore();
  const { einaSeleccionada, setEinaSeleccionada } = useEinesStore();

  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsMobilePortrait(isMobile && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const applyBackgroundIfSelected = () => {
    if (colorEscollitTemporal) {
      setGeneralBackgroundColor(colorEscollitTemporal);
      setColorEscollitTemporal('');
    }
  };

  const iconsForCursor = ['cut', 'merge', 'eraser', 'text', 'paint'];

  if (isMobilePortrait) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center px-6">
        <p className="text-lg font-semibold mb-3">📱 Gira el dispositiu</p>
        <p className="text-sm text-gray-300">Aquesta aplicació es veu millor en horitzontal.</p>
      </div>
    );
  }

   return (
    <motion.div
      className="flex flex-col w-full px-4 sm:px-8 items-center min-h-screen"
      style={{
        background: generalBackgroundColor ?? undefined,
        fontFamily: fontFamily ?? undefined,
      }}
      onClick={applyBackgroundIfSelected}
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >

      <div className="w-full max-w-5xl flex justify-end mt-4">
        <LanguageSelector />
      </div>
      {einaSeleccionada && iconsForCursor.includes(einaSeleccionada.id) && <CursorFlotant />}

      {/* ─── Barra superior amb eines i exportació ─── */}
      <motion.div
        className="w-full max-w-5xl flex justify-end mt-4 items-center gap-4"
        onClick={(e) => e.stopPropagation()}
        variants={itemVariants as Variants}
      >
        <div className="mt-4 max-w-5xl">
          <Eines />
        </div>
        <motion.div className="mr-6" whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}>
          <ExportaPDFButton targetId="taula-horari" fileName="HorariSetmanal.pdf" />
        </motion.div>
      </motion.div>

      {/* ─── Taula del planificador ─── */}
      <motion.div
        className="w-full max-w-5xl mt-6 flex flex-col items-center sm:ml-0"
        onClick={(e) => e.stopPropagation()}
        variants={itemVariants as Variants}
        transition={{ delay: 0.1 }}
      >
        <PlanejadorSetmanal />
      </motion.div>

      {/* ─── Formulari d'activitats─── */}
      {einaSeleccionada?.id === 'form' && (
         <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/5 backdrop-blur-xs"
          onClick={() => setEinaSeleccionada(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative p-6 rounded-xl bg-gray-700 z-10"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-200 hover:text-gray-800 font-bold text-lg"
              onClick={() => setEinaSeleccionada(null)}
            >
              ×
            </button>
            <FormulariActivitat />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default App;