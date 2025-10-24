import { PlanejadorSetmanal }from './components/PlanejadorSetmanal';
import { Eines } from './components/Eines';
import { usePlanejadorStore } from './stores/store';
import { useEinesStore } from './stores/storeEines';
import { Formulari } from './components/Formulari';




function App() {

  const { colorEscollitTemporal, setGeneraBackgroundColor, generaBackgroundColor, setColorEscollitTemporal} = usePlanejadorStore();
  const { einaSeleccionada } = useEinesStore();

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
      {/* ─── Formulari d'activitats─── */}
  {einaSeleccionada?.nom === 'Afegeix activitat' && 
    <div onClick={(e) => e.stopPropagation()}>
    <Formulari />
    </div>
  } 
    </div>
  );
  

}

export default App
