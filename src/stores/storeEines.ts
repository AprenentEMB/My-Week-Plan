import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Eina {
    nom: string;
    icona: string; // podria ser una URL o un nom de classe d'icona

}

interface EinesState {
    einesDisponibles: Eina[];
    einaSeleccionada: Eina | null;
    setEinaSeleccionada: (eina: Eina | null) => void;
}

export const useEinesStore = create<EinesState>()(
    persist(
        (set) => ({
            einesDisponibles: [
                { nom: 'Parteix', icona: '✂️' },
                { nom: 'Fusiona', icona: '🔗' },
                { nom: 'Goma', icona: '🩹' },
                { nom: 'Pinta', icona: '🎨' },
            ],
            einaSeleccionada: null,
            setEinaSeleccionada: (eina) => set({ einaSeleccionada: eina }),
        }),
        {
            name: 'eines-storage', // nom de la clau a l'emmagatzematge
        }
    )
);