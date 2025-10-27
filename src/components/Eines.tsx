import { useState} from "react";
import { useEinesStore } from "../stores/storeEines";
import { usePlanejadorStore } from "../stores/store"; // ajusta la ruta si cal
import { palette } from "../conts/paleta"; // defineix una paleta de colors aquí o importa-la des d'un altre lloc

export function Eines() {
  const { einesDisponibles, einaSeleccionada, setEinaSeleccionada } = useEinesStore();
  const { colorEscollitTemporal, setColorEscollitTemporal } = usePlanejadorStore();
  const [ openColorPicker, setOpenColorPicker ] = useState(false);



 

  const handleEinaClick = (eina: { nom: string; icona: string }) => {
    if (eina.nom === "Deixa l'eina") {
      // desselecciona qualsevol eina activa
      setEinaSeleccionada(null);
      setColorEscollitTemporal("");
      return;
    }
    if (eina.nom === "Formulari afegir activitat") {
      // Lògica per obrir el formulari d'afegir activitat
      // Aquesta part dependrà de com estigui implementat el formulari a la teva aplicació
      return;
    }
  if (eina.nom === "Pinta") {
    // obre el selector de color directament
    setOpenColorPicker(true);
    setEinaSeleccionada(eina);
  } else {
    // per altres eines, només selecciona o desselecciona
    setOpenColorPicker(false);
    setEinaSeleccionada(einaSeleccionada?.nom === eina.nom ? null : eina);
  }
};

  const handleColorClick = (color: string) => () => {
    setColorEscollitTemporal(color);
    setOpenColorPicker(false);
    
  };


  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex space-x-2 justify-center mt-4">
        {einesDisponibles.map((eina) => (
            <div key={eina.nom} className="flex flex-col items-center gap-3">
    <button
      className={`w-16 h-16 flex items-center justify-center rounded-full border transition-colors ${
        einaSeleccionada?.nom === eina.nom ? "bg-blue-500 text-white" : "bg-white text-black"
      }`}
      onClick={() => handleEinaClick(eina)}
      type="button"
    >
      <span className="text-2xl leading-none">{eina.icona}</span>
    </button>
    <div className="text-xs text-center px-1">{eina.nom}</div>
  </div>
        ))}
      </div>

      {/* Modal central per a l'eina "Pinta" */}
      {openColorPicker && einaSeleccionada?.nom === "Pinta" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md p-4 bg-white rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Tria color per pintar (s'utilitzarà en el següent clic):</div>
              <button
                aria-label="Tanca"
                onClick={() => { setOpenColorPicker(false); setEinaSeleccionada(null); }}
                className="text-gray-600 hover:text-gray-900 ml-2"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {palette.map((c) => (
                <button
                  key={c}
                  aria-label={`Selecciona ${c}`}
                  title={c}
                  onClick={handleColorClick(c)}
                  className={`w-8 h-8 rounded border ${colorEscollitTemporal === c ? "ring-2 ring-offset-1 ring-blue-500" : ""}`}
                  style={{ background: c }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}