import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type BuyMeCoffeeModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const CoffeeModal: React.FC<BuyMeCoffeeModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-lg text-center relative shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 font-bold text-2xl"
              onClick={onClose}
            >
              ×
            </button>
            <p className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t('modal.export_done')} 🎉
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 text-base">
              {t('modal.support_message')}
            </p>
            <a
              href="https://buymeacoffee.com/weekme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white text-lg font-medium hover:bg-teal-700 transition-colors"
              onClick={onClose}
            >
              {t('modal.buy_coffee')} ☕
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

