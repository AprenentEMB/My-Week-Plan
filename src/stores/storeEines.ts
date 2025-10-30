import { create } from 'zustand';
import i18n from '../i18n';

export interface Eina {
  id: string;
  nom: string;
  icona: string;
}

interface EinesState {
  einesDisponibles: Eina[];
  einaSeleccionada: Eina | null;
  setEinaSeleccionada: (eina: Eina | null) => void;
  updateTranslations: () => void; // 👈 mètode nou
}

const getTranslatedTools = () => {
  const t = i18n.t.bind(i18n);
  return [
    { id: 'leaveTool', nom: t('tools.leaveTool'), icona: '✋' },
    { id: 'cut', nom: t('tools.cut'), icona: '✂️' },
    { id: 'merge', nom: t('tools.merge'), icona: '🔗' },
    { id: 'erase', nom: t('tools.erase'), icona: '🩹' },
    { id: 'font', nom: t('tools.font'), icona: '🔤' },
    { id: 'paint', nom: t('tools.paint'), icona: '🎨' },
    { id: 'form', nom: t('tools.addActivity'), icona: '📝' },
    { id: 'undo', nom: t('tools.undo'), icona: '↩️' },
    { id: 'redo', nom: t('tools.redo'), icona: '↪️' },
    { id: 'reset', nom: t('tools.reset'), icona: '♻️' },
    { id: 'howItWorks', nom: t('tools.howItWorks'), icona: '❓' },
    { id: 'clock', nom: t('tools.clock'), icona: '⏰' },
  ];
};

export const useEinesStore = create<EinesState>((set) => ({
  einesDisponibles: getTranslatedTools(),
  einaSeleccionada: null,
  setEinaSeleccionada: (eina) => set({ einaSeleccionada: eina }),
  updateTranslations: () => set({ einesDisponibles: getTranslatedTools() }), // 👈 aquí el truco
}));

