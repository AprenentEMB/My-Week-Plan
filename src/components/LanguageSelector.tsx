import i18n from 'i18next';
import { useEinesStore } from '../stores/storeEines';

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
      <button onClick={() => changeLanguage('ca')}>🇦🇩 CA</button>
      <button onClick={() => changeLanguage('es')}>🇪🇸 ES</button>
      <button onClick={() => changeLanguage('en')}>🇬🇧 EN</button>
    </div>
  );
}


