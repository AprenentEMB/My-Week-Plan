import { PlanejadorSetmanal }from './components/PlanejadorSetmanal';
import { Eines } from './components/Eines';
import { usePlanejadorStore } from './stores/store';
import { useEinesStore } from './stores/storeEines';
import { FormulariActivitat } from "./components/Formulari";
import { ExportaPDFButton } from './components/ExportaPDFButton';





function App() {

  const { colorEscollitTemporal, setGeneralBackgroundColor, generalBackgroundColor, setColorEscollitTemporal, fontFamily} = usePlanejadorStore();
  const { einaSeleccionada, setEinaSeleccionada } = useEinesStore();

   const applyBackgroundIfSelected = () => {
    if (colorEscollitTemporal) {
      setGeneralBackgroundColor(colorEscollitTemporal);
      setColorEscollitTemporal("");
    }
  };


  
   return (
    // clicant aquí fora aplicarà el color temporal com a background general
    <div
      className="flex flex-col w-full px-4 sm:px-8 items-center min-h-screen"
      style={{ background: generalBackgroundColor ?? undefined,
         fontFamily: fontFamily ?? undefined }}
      onClick={applyBackgroundIfSelected}
    >
      <div className="w-full max-w-5xl flex justify-end mt-4">
      
      {/* ─── Eines a la part superior ─── */}
      <div className="mt-4 w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Eines />
      </div>
      <div className="ml-4">
      <ExportaPDFButton targetId="taula-horari" fileName="HorariSetmanal.pdf" />
      </div>
      </div>

      {/* ─── Taula del planificador ─── */}
      <div className="w-full max-w-5xl mt-6 flex flex-col items-center sm:ml-0" onClick={(e) => e.stopPropagation()}>
  <PlanejadorSetmanal />
  
    
 
</div>
      {/* ─── Formulari d'activitats─── */}
  {einaSeleccionada?.nom === 'Afegeix activitat' && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/5 backdrop-blur-xs" onClick={() => setEinaSeleccionada(null)}>
    <div className="relative p-6 rounded-xl bg-gray-700 z-10" onClick={(e) => e.stopPropagation()} >
      {/* Creu a dalt a la dreta */}
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-200 hover:text-gray-800 font-bold text-lg"
        onClick={() => setEinaSeleccionada(null)}
      >
        ×
      </button>

      {/* Formulari */}
      <FormulariActivitat />
      
    </div>
  </div>
)}

    </div>
  );
  

}

export default App
