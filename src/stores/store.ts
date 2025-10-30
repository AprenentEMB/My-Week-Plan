import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Fusio {
  superior: string;
  files: number;
}

interface PlanejadorState {
  activitats: Record<string, string>;
  hores: string[];
  cellaFusionada: Fusio[];
  generalBackgroundColor: string;
  fontFamily: string;
  cellsBackgroundsColor: Record<string, string>;
  colorEscollitTemporal?: string;
  rellotgeActiu?: boolean;
  pastStates: Partial<PlanejadorState>[];
  futureStates: Partial<PlanejadorState>[];

  // Funcions
  setActivitats: (clau: string, valor: string) => void;
  setHores: (hores: string[]) => void;
  setCellaFusionada: (fusions: Fusio[]) => void;
  setGeneralBackgroundColor: (color: string) => void;
  setCellsBackgroundsColor: (clau: string, color: string) => void;
  setColorEscollitTemporal: (color: string) => void;
  setFontFamily: (font: string) => void;
  setResetPlanejador: () => void;
  setRellotgeActiu: (actiu: boolean) => void;

  // Undo/redo
  setStateSnapshot: (newState: Partial<PlanejadorState>) => void;
  desferAccio: () => void;
  referAccio: () => void;
}

export const usePlanejadorStore = create<PlanejadorState>()(
  persist(
    (set, get) => ({
      activitats: {},
      hores: Array.from({ length: 24 }, (_, i) => `${String((i + 7) % 24).padStart(2, '0')}:00`),
      cellaFusionada: [],
      generalBackgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      cellsBackgroundsColor: {},
      colorEscollitTemporal: undefined,
      pastStates: [],
      futureStates: [],
      rellotgeActiu: false,

      // Funcions
      setActivitats: (clau, valor) => {
        get().setStateSnapshot({ activitats: { ...get().activitats, [clau]: valor } });
        set({ activitats: { ...get().activitats, [clau]: valor } });
      },

      setHores: hores => {
        get().setStateSnapshot({ hores });
        set({ hores });
      },

      setCellaFusionada: fusions => {
        get().setStateSnapshot({ cellaFusionada: fusions });
        set({ cellaFusionada: fusions });
      },

      setGeneralBackgroundColor: color => {
        get().setStateSnapshot({ generalBackgroundColor: color });
        set({ generalBackgroundColor: color });
      },

      setCellsBackgroundsColor: (clau, color) => {
        const newColors = { ...get().cellsBackgroundsColor, [clau]: color };
        get().setStateSnapshot({ cellsBackgroundsColor: newColors });
        set({ cellsBackgroundsColor: newColors });
      },

      setColorEscollitTemporal: color => set({ colorEscollitTemporal: color }),
      setFontFamily: font => set({ fontFamily: font }),

      setResetPlanejador: () => {
        get().setStateSnapshot({
          activitats: {},
          hores: Array.from(
            { length: 24 },
            (_, i) => `${String((i + 7) % 24).padStart(2, '0')}:00`
          ),
          cellaFusionada: [],
          generalBackgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
          cellsBackgroundsColor: {},
          colorEscollitTemporal: undefined,
        });

        set({
          activitats: {},
          hores: Array.from(
            { length: 24 },
            (_, i) => `${String((i + 7) % 24).padStart(2, '0')}:00`
          ),
          cellaFusionada: [],
          generalBackgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
          cellsBackgroundsColor: {},
          colorEscollitTemporal: undefined,
        });
      },

      // Undo/redo
      setStateSnapshot: newState => {
        const {
          activitats,
          hores,
          cellaFusionada,
          generalBackgroundColor,
          fontFamily,
          cellsBackgroundsColor,
          pastStates,
        } = get();

        const snapshot: Partial<PlanejadorState> = {
          activitats,
          hores,
          cellaFusionada,
          generalBackgroundColor,
          fontFamily,
          cellsBackgroundsColor,
        };

        set({
          ...newState,
          pastStates: [...(pastStates ?? []), snapshot],
          futureStates: [],
        });
      },

      desferAccio: () => {
        const { pastStates, futureStates, ...currentState } = get();
        if (!pastStates || pastStates.length === 0) return;

        const previousState = pastStates[pastStates.length - 1];
        set({
          ...previousState,
          pastStates: pastStates.slice(0, -1),
          futureStates: [currentState, ...(futureStates ?? [])],
        });
      },

      referAccio: () => {
        const { pastStates, futureStates, ...currentState } = get();
        if (!futureStates || futureStates.length === 0) return;

        const nextState = futureStates[0];
        set({
          ...nextState,
          pastStates: [...(pastStates ?? []), currentState],
          futureStates: futureStates.slice(1),
        });
      },

      setRellotgeActiu: (actiu: boolean) => set({ rellotgeActiu: actiu }),
    }),
    { name: 'planejador-storage' }
  )
);
