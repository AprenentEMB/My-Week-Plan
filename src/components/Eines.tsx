import { useEinesStore } from "../stores/storeEines";
import { usePlanejadorStore } from "../stores/store";



export function Eines() {

    const {
        einesDisponibles,
        einaSeleccionada,
        setEinaSeleccionada
    } = useEinesStore();
     const { colorEscollitTemporal, setColorEscollitTemporal } = usePlanejadorStore();

  const palette = [
    "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0",
    "#fecaca", "#fb923c", "#facc15", "#86efac",
    "#60a5fa", "#7c3aed", "#000000"
  ];
    
    return (
        <div className="flex space-x-4 justify-center mt-4">
            {einesDisponibles.map((eina) => (
                <button
                    key={eina.nom}
                    className={`p-2 border rounded ${
                        einaSeleccionada?.nom === eina.nom ? 'bg-blue-500 text-white' : 'bg-white text-black'
                    }`}
                    onClick={() => setEinaSeleccionada(einaSeleccionada?.nom === eina.nom ? null : eina)}
                >
                    <span className="text-2xl">{eina.icona}</span>
                    <div className="text-sm">{eina.nom}</div>
                </button>
            ))}
            {einaSeleccionada && einaSeleccionada.nom === "Pinta" && (
        <div className="w-full max-w-xs p-2 bg-white border rounded shadow-sm">
          <div className="text-sm mb-2">Tria color per pintar (s'utilitzarà en el següent clic):</div>
          <div className="flex flex-wrap gap-2">
            {palette.map((c) => (
              <button
                key={c}
                aria-label={`Selecciona ${c}`}
                title={c}
                onClick={() => setColorEscollitTemporal(c)}
                className={`w-8 h-8 rounded border ${colorEscollitTemporal === c ? "ring-2 ring-offset-1 ring-blue-500" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}
        </div>
    );

  
}