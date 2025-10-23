import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlanejadorState {
    activitats: Record<string, string>;
    hores: string[];
    setActivitats: (clau: string, valor: string) => void;
    setHores: (hores: string[]) => void;
    cellafusionada: string[];
    setCellaFusionada: (clau: string[]) => void;
    colorEscollitTemporal?: string;
    generaBackgroundColor?: string;
    cellsBackgroundsColor?: Record<string, string>;
    setGeneraBackgroundColor: (color: string) => void;
    setCellsBackgroundsColor: (clau: string, color: string) => void;
    setColorEscollitTemporal: (color: string) => void;

}

export const usePlanejadorStore = create<PlanejadorState>()(
    persist(
        (set) => ({
            activitats: {},
            hores: Array.from({ length: 24 }, (_, i) => `${String((i + 7) % 24).padStart(2, '0')}:00`),
            cellafusionada: [],
            generaBackgroundColor: "black",
            cellsBackgroundsColor: {},
            colorEscollitTemporal: undefined,
            setCellaFusionada: (clau) =>
                set(() => ({
                    cellafusionada: clau,
                })),
            setActivitats: (clau, valor) =>
                set((state) => ({
                    activitats: {
                        ...state.activitats,
                        [clau]: valor,
                    },
                })),
            setHores: (hores) => set({ hores }),
            setCellsBackgroundsColor: (clau, color) =>
                set((state) => ({
                    cellsBackgroundsColor: {
                        ...state.cellsBackgroundsColor,
                        [clau]: color,
                    },
                })),
                setGeneraBackgroundColor: (color) =>
                set(() => ({
                    generaBackgroundColor: color,
                })),
                setColorEscollitTemporal: (color) =>
                set(() => ({
                    colorEscollitTemporal: color,
                })),
        }),
        {
            name: 'planejador-storage', // nom de la clau a l'emmagatzematge
        }
    )
);