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
import { SidebarLeft } from './components/SideBar';
import { CoffeeModal } from './components/CoffeModal';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Hero } from './components/Hero';

function App() {
  const {
    colorEscollitTemporal,
    setGeneralBackgroundColor,
    generalBackgroundColor,
    setColorEscollitTemporal,
    fontFamily,
    exportantPDF,
  } = usePlanejadorStore();
  const { einaSeleccionada, setEinaSeleccionada } = useEinesStore();

  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [coffeeModalVisible, setCoffeeModalVisible] = useState(false);
  const { t, i18n } = useTranslation();

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
        <p className="text-lg font-semibold mb-3">📱 Please rotate your device</p>
        <p className="text-sm text-gray-300">WeekMePro works better in landscape mode.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="
        flex flex-col w-full min-h-screen
        px-3 sm:px-8
        items-start sm:items-center
        overflow-x-auto overflow-y-auto
        sm:overflow-x-hidden
      "
      style={{
        background: generalBackgroundColor ?? undefined,
        fontFamily: fontFamily ?? undefined,
      }}
      onClick={applyBackgroundIfSelected}
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar (no afecta mòbil) */}
      <SidebarLeft />

      {/* ─── Contingut principal ─── */}
      <div className="w-full flex flex-col items-start sm:items-center">

        {/* Header / Branding */}
        <div className="w-full max-w-5xl flex items-center justify-between mt-4 px-2 sm:ml-16">
          <motion.h1
            className="text-xl sm:text-3xl text-gray-900 font-semibold whitespace-nowrap"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            Week<span className="text-teal-600">Me</span>Pro
          </motion.h1>
          <LanguageSelector />
        </div>

        <Helmet>
          <html lang={i18n.language} />
          <title>{t('seo.title')}</title>
          <meta name="description" content={t('seo.description')} />
          <meta property="og:title" content={t('seo.title')} />
          <meta property="og:description" content={t('seo.description')} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://weekmepro.com" />
          <link rel="canonical" href="https://weekmepro.com" />
        </Helmet>

        <Hero />
        <h1 className="sr-only">{t('seo.title')}</h1>

        {/* Cursor flotant */}
        {einaSeleccionada && iconsForCursor.includes(einaSeleccionada.id) && <CursorFlotant />}

        {/* Barra superior d’eines */}
        <motion.div
          className="
            w-full max-w-6xl mt-4
            flex items-start gap-3
            overflow-x-auto sm:overflow-x-visible
            px-1
          "
          onClick={e => e.stopPropagation()}
          variants={itemVariants as Variants}
          style={{
            minHeight: '7rem',
            background: generalBackgroundColor,
          }}
        >
          <div className="flex items-center gap-2 min-w-max px-2 sm:pl-16">
            <Eines />
          </div>

          <motion.div
            className="shrink-0 mr-2 sm:mr-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ExportaPDFButton
              targetId="taula-horari"
              fileName="WeekMePro.pdf"
              setCoffeeModalVisible={setCoffeeModalVisible}
            />
          </motion.div>
          <CoffeeModal visible={coffeeModalVisible} onClose={() => setCoffeeModalVisible(false)} />
        </motion.div>

 {/* ─── Taula planificador ─── */}
<div className="w-full flex justify-center pl-0 md:pl-26 xl:pl-0">
  <motion.div
    className={`w-full mt-6 flex flex-col items-stretch min-w-0 ${
      exportantPDF ? 'max-w-none min-h-full' : 'max-w-5xl'
    }`}
    onClick={e => e.stopPropagation()}
    variants={itemVariants as Variants}
    transition={{ delay: 0.1 }}
    style={{
      WebkitOverflowScrolling: 'touch',
      background: generalBackgroundColor,
      width: '100%',
      minHeight: exportantPDF ? 'fit-content' : 'auto',
      display: 'flex',
    }}
  >
    {/* ⚡ Només a mòbil: envoltem la taula amb overflow-x-auto */}
    <div className="w-full sm:overflow-visible overflow-x-auto">
      <div className="min-w-[900px] sm:min-w-0">
        <PlanejadorSetmanal />
      </div>
    </div>
  </motion.div>
</div>

      </div>

      {/* ─── Formulari activitats ─── */}
      {einaSeleccionada?.id === 'form' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/5 backdrop-blur-xs px-2"
          onClick={() => setEinaSeleccionada(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative p-4 sm:p-6 rounded-xl bg-gray-700 z-10 w-full max-w-md"
            onClick={e => e.stopPropagation()}
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

