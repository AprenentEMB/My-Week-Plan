import { useState, useRef, useEffect } from 'react';
import { useEinesStore } from '../stores/storeEines';
import { usePlanejadorStore } from '../stores/store';
import { useHours } from '../hooks/useHours';
import { Cella } from './Cella';
import { RowHeader } from './RowHeader';
import { textColorClassForBackground } from '../utils/text-color';
import { diesSetmana } from '../const/dies-de-la-setmana';
import { motion } from 'framer-motion';
import type { ElementType } from 'react';



export function PlanejadorSetmanal() {
  const hores = usePlanejadorStore(state => state.hores);
  const activitats = usePlanejadorStore(state => state.activitats);
  const setActivitats = usePlanejadorStore(state => state.setActivitats);
  const generalBackgroundColor = usePlanejadorStore(state => state.generalBackgroundColor);
  const setGeneralBackgroundColor = usePlanejadorStore(state => state.setGeneralBackgroundColor);
  const colorEscollitTemporal = usePlanejadorStore(state => state.colorEscollitTemporal);
  const exportantPDF = usePlanejadorStore(state => state.exportantPDF); // ✅

  const { einaSeleccionada } = useEinesStore();
  const { handleDividir, handleUnir } = useHours();
  const [editant, setEditant] = useState<string | null>(null);
  const [animantFila, setAnimantFila] = useState<string | null>(null);

  const [rowHeights, setRowHeights] = useState<Record<string, number>>(
    hores.reduce((acc, h) => ({ ...acc, [h]: 40 }), {}) // Altura inicial 40px
  );
  const resizingRowRef = useRef<string | null>(null);

  const començarEdicio = (clau: string) => setEditant(clau);
  const guardarEdicio = (clau: string, nouValor: string) => {
    setActivitats(clau, nouValor);
    setEditant(null);
  };

  const handleJoinOrDivide = (hora: string) => {
    setAnimantFila(hora);
    if (einaSeleccionada) {
      if (einaSeleccionada.id === 'cut') {
        setTimeout(() => handleDividir(hora), 500);
      } else if (einaSeleccionada.id === 'merge') {
        setTimeout(() => handleUnir(hora), 500);
      }
    }
    setTimeout(() => setAnimantFila(null), 600);
  };

  // Drag vertical
  const onMouseMove = (e: MouseEvent) => {
    if (!resizingRowRef.current) return;
    const row = resizingRowRef.current;
    const rect = document.getElementById(`row-${row}`)?.getBoundingClientRect();
    if (!rect) return;
    const novaAltura = Math.max(30, e.clientY - rect.top);
    setRowHeights(prev => ({ ...prev, [row]: Math.round(novaAltura) })); // ✅ arrodonim
  };

  const onMouseUp = () => {
    resizingRowRef.current = null;
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const RowComponent: ElementType = exportantPDF ? 'tr' : motion.tr; // ✅ tr pur durant export

 return (
  <div
    id="taula-horari"
    className="
      w-full height-auto rounded-md shadow-lg
      p-2 sm:p-6 pb-20 mb-3 z-0 pdf-friendly
      overflow-x-auto overflow-y-auto sm:overflow-visible
    "
    style={{
      WebkitOverflowScrolling: 'touch',
      background: generalBackgroundColor,
    }}
    onClick={() => {
      if (einaSeleccionada?.id === 'paint') {
        setGeneralBackgroundColor(colorEscollitTemporal || 'white');
      }
    }}
  >
   <table
  className="table-auto sm:min-w-[700px]"
  style={{
    backgroundColor: generalBackgroundColor,
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  }}
  onClick={e => e.stopPropagation()}
>
      <thead>
        <RowHeader />
      </thead>

      <tbody>
        {hores.map(hora => {
          const esFilaAnimant = animantFila === hora;
          const textColorClass = textColorClassForBackground(generalBackgroundColor);

          const horaClasses = [
            'p-1 sm:p-2',
            'text-xs sm:text-sm md:text-base',
            'font-medium',
            'cursor-pointer',
            textColorClass,
            'bg-transparent',
            'sticky left-0 sm:static',
            'z-10',
          ].join(' ');

          return (
            <RowComponent
              key={hora}
              id={`row-${hora}`}
              {...(!exportantPDF && {
                initial: esFilaAnimant ? { opacity: 0, y: -20 } : false,
                animate: {
                  backgroundColor: esFilaAnimant ? '#f0f9ff' : 'transparent',
                  opacity: esFilaAnimant ? 0.2 : 1,
                  y: 0,
                },
                transition: { duration: 0.5, ease: 'easeOut' },
              })}
              className="relative"
              style={{ height: rowHeights[hora], position: 'relative' }}
            >
              <td
                className={horaClasses}
                onClick={() => handleJoinOrDivide(hora)}
                title="Fes clic per aplicar l’eina seleccionada"
                style={{ background: generalBackgroundColor }}
              >
                {hora}
              </td>

              {diesSetmana.map(dia => {
                const clau = `${dia}-${hora}`;
                return (
                  <Cella
                    key={clau}
                    clau={clau}
                    estaEditant={editant === clau}
                    valor={activitats[clau] || ''}
                    començarEdicio={començarEdicio}
                    guardarEdicio={guardarEdicio}
                  />
                );
              })}

              {!exportantPDF && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 8,
                    cursor: 'row-resize',
                    userSelect: 'none',
                    pointerEvents: 'auto',
                  }}
                  onMouseDown={() => (resizingRowRef.current = hora)}
                />
              )}
            </RowComponent>
          );
        })}
      </tbody>
    </table>
  </div>
);

}


/*

Que el pdf s'exporti bé i que es vegin les ralles de les celes amb el fons blanc

*/
