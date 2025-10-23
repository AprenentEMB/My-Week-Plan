import { PlanejadorSetmanal }from './components/PlanejadorSetmanal';
import { Eines } from './components/Eines';
import { usePlanejadorStore } from './stores/store';




function App() {

  const { colorEscollitTemporal, setGeneraBackgroundColor, generaBackgroundColor, setColorEscollitTemporal} = usePlanejadorStore();

   const applyBackgroundIfSelected = () => {
    if (colorEscollitTemporal) {
      setGeneraBackgroundColor(colorEscollitTemporal);
      setColorEscollitTemporal("");
    }
  };
   return (
    // clicant aquí fora aplicarà el color temporal com a background general
    <div
      className="flex flex-col items-center min-h-screen"
      style={{ backgroundColor: generaBackgroundColor ?? undefined }}
      onClick={applyBackgroundIfSelected}
    >
      {/* ─── Eines a la part superior ─── */}
      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
        <Eines />
      </div>

      {/* ─── Taula del planificador ─── */}
      <div className="ml-8" onClick={(e) => e.stopPropagation()}>
        <PlanejadorSetmanal />
      </div>
    </div>
  );
}

export default App
