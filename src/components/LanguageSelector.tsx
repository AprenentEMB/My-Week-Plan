import i18n from 'i18next';
import { useEinesStore } from '../stores/storeEines';
import { motion } from 'framer-motion';

export function LanguageSelector() {
  const updateTranslations = useEinesStore((state) => state.updateTranslations);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      updateTranslations(); // 👈 refresca la store
      localStorage.setItem('lang', lang);
    });
  };

  return (
    <div className="flex gap-2 items-center bg-gray-800 text-white px-3 py-1 rounded-lg">
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => changeLanguage('ca')}> CAT</motion.button>
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => changeLanguage('es')}> ESP</motion.button>
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => changeLanguage('en')}> ENG</motion.button>
    </div>
  );
}


