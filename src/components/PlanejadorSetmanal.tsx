import { useState } from 'react';
import { useEinesStore } from '../stores/storeEines';
import { usePlanejadorStore } from '../stores/store';
import { useHours } from '../hooks/useHours';
import { ca } from 'date-fns/locale';
import { useHoraActual } from '../utils/hora-actual';
import { Cella } from './Cella';
import { RowHeader } from './RowHeader';
import { textColorClassForBackground } from '../utils/text-color';
import { diesSetmana } from '../const/dies-de-la-setmana';
import { motion } from 'framer-motion';

export function PlanejadorSetmanal() {
  const hores = usePlanejadorStore(state => state.hores);
  const activitats = usePlanejadorStore(state => state.activitats);
  const setActivitats = usePlanejadorStore(state => state.setActivitats);
  const generalBackgroundColor = usePlanejadorStore(state => state.generalBackgroundColor);
  const setGeneralBackgroundColor = usePlanejadorStore(state => state.setGeneralBackgroundColor);
  const colorEscollitTemporal = usePlanejadorStore(state => state.colorEscollitTemporal);
  const rellotgeActiu = usePlanejadorStore(state => state.rellotgeActiu);

  const { einaSeleccionada } = useEinesStore();
  const { handleDividir, handleUnir } = useHours();
  const [editant, setEditant] = useState<string | null>(null);
  const [animantFila, setAnimantFila] = useState<string | null>(null);

  const horaActual = useHoraActual({
    intervalMs: 15_000,
    format: 'HH:mm',
    locale: ca,
  });

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

  return (
    <div
      id="taula-horari"
      className="overflow-x-auto rounded-md shadow-lg p-2 sm:p-6 pb-20 mb-3 z-0"
      onClick={() => {
        if (einaSeleccionada?.id === 'paint') {
          setGeneralBackgroundColor(colorEscollitTemporal || 'white');
        }
      }}
    >
      <table
        className="min-w-[800px] sm:min-w-full table-auto border-collapse border border-gray-300 z-10"
        style={{ backgroundColor: generalBackgroundColor }}
        onClick={e => e.stopPropagation()}
      >
        <thead>
          <RowHeader />
        </thead>

        <tbody>
          {hores.map(hora => {
            const [h, m] = hora.split(':').map(Number);
            const [hc, mc] = horaActual.split(':').map(Number);

            const horaEnMinuts = h * 60 + m;
            const actualEnMinuts = hc * 60 + mc;

            const index = hores.indexOf(hora);
            const nextHora = hores[index + 1];
            const nextEnMinuts = nextHora
              ? Number(nextHora.split(':')[0]) * 60 + Number(nextHora.split(':')[1])
              : horaEnMinuts + 60;

            const esHoraActual = actualEnMinuts >= horaEnMinuts && actualEnMinuts < nextEnMinuts;
            const esFilaAnimant = animantFila === hora;

            const textColorClass =
              esHoraActual && rellotgeActiu
                ? 'text-slate-700'
                : textColorClassForBackground(generalBackgroundColor);
            const horaClasses = [
              'border',
              'p-1 sm:p-2',
              'text-xs sm:text-sm md:text-base',
              'font-medium',
              'cursor-pointer',
              textColorClass,
              esHoraActual && rellotgeActiu
                ? 'bg-blue-100 border-blue-500 shadow-md text-slate-700'
                : 'bg-transparent',
            ].join(' ');

            return (
              <motion.tr
                key={hora}
                initial={esFilaAnimant ? { opacity: 0, y: -20 } : undefined}
                animate={{
                  backgroundColor: esFilaAnimant
                    ? '#f0f9ff'
                    : esHoraActual && rellotgeActiu
                      ? '#dbeafe' // blau clar per l’hora actual
                      : 'transparent',
                  opacity: esFilaAnimant ? 0.2 : 1,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="transition-colors duration-300"
              >
                <td
                  className={horaClasses}
                  onClick={() => handleJoinOrDivide(hora)}
                  title="Fes clic per aplicar l’eina seleccionada"
                >
                  {hora}
                </td>

                {diesSetmana.map(dia => {
                  const clau = `${dia}-${hora}`;
                  const estaEditant = editant === clau;

                  return (
                    <Cella
                      key={clau}
                      clau={clau}
                      estaEditant={estaEditant}
                      valor={activitats[clau] || ''}
                      començarEdicio={començarEdicio}
                      guardarEdicio={guardarEdicio}
                    />
                  );
                })}
              </motion.tr>
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
