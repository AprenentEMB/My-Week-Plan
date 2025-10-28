import { create } from 'zustand';


export interface Eina {
    nom: string;
    icona: string; // podria ser una URL o un nom de classe d'icona

}

interface EinesState {
    einesDisponibles: Eina[];
    einaSeleccionada: Eina | null;
    setEinaSeleccionada: (eina: Eina | null) => void;
}

export const useEinesStore = create<EinesState>(
    
        (set) => ({
            einesDisponibles: [
                { nom: 'Parteix', icona: '✂️' },
                { nom: 'Fusiona', icona: '🔗' },
                { nom: 'Goma', icona: '🩹' },
                { nom: 'Tipografia', icona: '🔤' },
                { nom: 'Pinta', icona: '🎨' },
                { nom: 'Deixa l\'eina', icona: '✋' },
                { nom: 'Afegeix activitat', icona: '📝' },
            ],
            einaSeleccionada: null,
            setEinaSeleccionada: (eina) => set({ einaSeleccionada: eina }),
        }),
        
    );