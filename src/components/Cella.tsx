import { useState} from "react";
import { useEinesStore } from "../stores/storeEines";
import { usePlanejadorStore } from "../stores/store";

export interface CellaProps {
  clau: string;
  estaEditant: boolean;
  valor: string;
  començarEdicio: (clau: string) => void;
  guardarEdicio: (clau: string, nouValor: string) => void;
}

export function Cella({ clau, estaEditant, valor, començarEdicio, guardarEdicio}: CellaProps) {

  const { einaSeleccionada, setEinaSeleccionada} = useEinesStore();

  const [valorTemporal, setValorTemporal] = useState<string>(valor);

  const { cellafusionada, setCellaFusionada, colorEscollitTemporal, setCellsBackgroundsColor, cellsBackgroundsColor = {}, hores} = usePlanejadorStore();

  return (
    <td className={`border border-gray-300 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-100 cursor-pointer ${cellafusionada.includes(clau) ? "border-b-transparent" : "border-b-white"}`} style={cellsBackgroundsColor[clau] ? { backgroundColor: cellsBackgroundsColor[clau] } : undefined}  onClick={() => {
      if (einaSeleccionada?.nom === "Pinta" && colorEscollitTemporal) {
    // si la cel·la està fusionada, també pintem la cel·la de sota (si existeix)
    if (cellafusionada.includes(clau)) {
      const [dia, hora] = clau.split("-");
      const idx = hores.indexOf(hora);
      if (idx !== -1 && idx < hores.length - 1) {
        const clauBaixa = `${dia}-${hores[idx + 1]}`;
        setCellsBackgroundsColor(clauBaixa, colorEscollitTemporal);
      }
    }

    // pintem la cel·la clicada
    setCellsBackgroundsColor(clau, colorEscollitTemporal);
    setEinaSeleccionada(null);
    return;
  }
      if (einaSeleccionada?.nom === "Goma") {
        guardarEdicio(clau, "");
        setEinaSeleccionada(null);
        return;
      }
      if (einaSeleccionada?.nom === "Fusiona") {
        //fem que el color del background de la cela sigui el del bg per simular que s'ha esborrat
        setCellaFusionada([...cellafusionada, clau]);
        setEinaSeleccionada(null);
        return;
      }
      if (einaSeleccionada?.nom === "Parteix") {
        //si la cela esta fusionada, la separem
        setCellaFusionada(cellafusionada.filter(c => c !== clau));
        setEinaSeleccionada(null);
        return;
      }
      if (!estaEditant) començarEdicio(clau);
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !estaEditant) començarEdicio(clau);
    }}
    tabIndex={0}
        title="Fes clic per editar">
      {estaEditant ? (
        <input
          type="text"
          value={valorTemporal}
          autoFocus
          onChange={(e) => setValorTemporal(e.target.value)}
          className="border border-gray-400 p-1 w-full"
          onBlur={() => guardarEdicio(clau, valorTemporal)}
          onKeyDown={(e) => {
            if (e.key === "Enter") guardarEdicio(clau, valorTemporal);
          }}
        />
      ) : (
        <span>{valor}</span>
      )}
    </td>
  );
}
