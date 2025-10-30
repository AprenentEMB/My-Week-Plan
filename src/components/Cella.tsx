import { useState } from 'react';
import { usePlanejadorStore } from '../stores/store';
import { useEinesStore } from '../stores/storeEines';
import { textColorClassForBackground, isDark } from '../utils/text-color';

export function Cella({
  clau,
  valor,
  estaEditant,
  començarEdicio,
  guardarEdicio,
}: {
  clau: string;
  valor: string;
  estaEditant: boolean;
  començarEdicio: (clau: string) => void;
  guardarEdicio: (clau: string, nouValor: string) => void;
}) {
  const {
    hores,
    cellaFusionada,
    setCellaFusionada,
    cellsBackgroundsColor,
    setCellsBackgroundsColor,
    colorEscollitTemporal,
    generalBackgroundColor,
  } = usePlanejadorStore();
  const { einaSeleccionada } = useEinesStore();
  const [localValor, setLocalValor] = useState(valor);

  const [dia, hora] = clau.split('-');
  const idx = hores.indexOf(hora);

  // 🔹 Fusió múltiple
  const fusio = cellaFusionada.find(f => f.superior === clau);
  const esSuperiorFusionada = !!fusio;

  const esInferiorFusionada = cellaFusionada.some(f => {
    const idxSuperior = hores.indexOf(f.superior.split('-')[1]);
    const idxActual = hores.indexOf(hora);
    return (
      dia === f.superior.split('-')[0] &&
      idxActual > idxSuperior &&
      idxActual < idxSuperior + f.files
    );
  });

  if (esInferiorFusionada) return null;

  const rowSpan = esSuperiorFusionada ? fusio.files : 1;

  const cellBgColor = cellsBackgroundsColor?.[clau];
  const effectiveBg = cellBgColor ?? generalBackgroundColor ?? '#ffffff';
  const textClass = textColorClassForBackground(effectiveBg);

  const handleClick = () => {
    if (!einaSeleccionada) {
      if (!estaEditant) començarEdicio(clau);
      return;
    }

    switch (einaSeleccionada.id) {
      case 'merge':
        if (fusio) {
          const noves = cellaFusionada.map(f =>
            f.superior === clau ? { ...f, files: f.files + 1 } : f
          );
          setCellaFusionada(noves);
        } else {
          setCellaFusionada([...cellaFusionada, { superior: clau, files: 2 }]);
        }
        break;

      case 'cut':
        setCellaFusionada(cellaFusionada.filter(f => f.superior !== clau && !esInferiorFusionada));
        break;

      case 'paint':
        if (colorEscollitTemporal) {
          // pinta també cel·les fusionades
          if (esSuperiorFusionada) {
            for (let i = 0; i < rowSpan; i++) {
              const clauBaixa = `${dia}-${hores[idx + i]}`;
              setCellsBackgroundsColor(clauBaixa, colorEscollitTemporal);
            }
          } else {
            setCellsBackgroundsColor(clau, colorEscollitTemporal);
          }
        }
        break;

      case 'erase':
        // elimina el text
        guardarEdicio(clau, '');
        // elimina el color de fons
        if (esSuperiorFusionada) {
          for (let i = 0; i < rowSpan; i++) {
            const clauBaixa = `${dia}-${hores[idx + i]}`;
            setCellsBackgroundsColor(clauBaixa, '');
          }
        } else {
          setCellsBackgroundsColor(clau, '');
        }
        break;

      default:
        break;
    }
  };

  const colorPerElsBordes = isDark(effectiveBg) ? '#FFFFFF' : '#000000';

  return (
    <td
      rowSpan={rowSpan}
      className={`border border-${colorPerElsBordes} p-2 text-center cursor-pointer hover:bg-gray-100 ${
        textClass
      }`}
      style={cellBgColor ? { background: cellBgColor } : {}}
      onClick={handleClick}
    >
      {estaEditant ? (
        <input
          className={`w-full text-center border-none focus:ring-2 focus:ring-blue-400 text-${textClass}`}
          value={localValor}
          onChange={e => setLocalValor(e.target.value)}
          onBlur={() => guardarEdicio(clau, localValor)}
          onKeyDown={e => {
            if (e.key === 'Enter') guardarEdicio(clau, localValor);
            if (e.key === 'Escape') setLocalValor(valor);
          }}
          autoFocus
        />
      ) : (
        <span>{valor}</span>
      )}
    </td>
  );
}
