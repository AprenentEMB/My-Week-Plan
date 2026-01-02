import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export function Hero() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <section className="w-full max-w-5xl mt-8 sm:mt-12 px-4 sm:px-12 text-center">
      {/* ─── Títol principal sempre visible ─── */}
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight"
      >
        {t('hero.title')} <span className="text-teal-600">{t('hero.highlight')}</span>
      </motion.h2>

      {/* ─── Subtítol resum sempre visible ─── */}
      <motion.p
        className="mt-2 text-gray-700 text-base sm:text-lg max-w-2xl mx-auto"
      >
        {t('hero.resum')}
      </motion.p>

      {/* ─── Info extra desplegable ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mt-4 text-gray-700 text-base sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <p className="mb-2">{t('hero.subtitle')}</p>
            <p className="text-sm text-gray-500">{t('hero.meta')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Botó desplegable + indicatiu ─── */}
      <motion.div
        className="mt-2 text-teal-600 text-sm cursor-pointer select-none"
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
      >
        {open ? '▲ ' + t('hero.hide') : '▼ ' + t('hero.show')}
      </motion.div>
    </section>
  );
}

