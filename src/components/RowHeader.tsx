import { useState } from 'react';
import { diesSetmana } from '../const/dies-de-la-setmana';
import { textColorClassForBackground } from '../utils/text-color';
import { usePlanejadorStore } from '../stores/store';
import { useEinesStore } from '../stores/storeEines';
import { HoraHeader } from './HoraHeader';
import { useTranslation } from 'react-i18next';

export function RowHeader() {
  const { t } = useTranslation();
  const { colorEscollitTemporal } = usePlanejadorStore();
  const { einaSeleccionada } = useEinesStore();
  const [diesBackgroundColor, setDiesBackgroundColor] = useState<{
    [dia: string]: string;
  }>({});

  const setColorDia = (dia: string, color: string) =>
    setDiesBackgroundColor(prev => ({ ...prev, [dia]: color }));

  return (
    <tr>
      <HoraHeader />

      {diesSetmana.map(dia => {
        const bg = diesBackgroundColor[dia] ?? '#1f2937';
        const textClass = textColorClassForBackground(bg);

        return (
          <th
            key={dia}
            className={`w-20 min-w-[50px] lg:w-40 lg:min-w-[90px] border border-gray-300 p-2 text-center ${textClass}`}
            style={{ background: bg }}
            onClick={() => {
              if (einaSeleccionada?.id === 'paint' && colorEscollitTemporal) {
                setColorDia(dia, colorEscollitTemporal);
              } else if (einaSeleccionada?.id === 'erase') {
                setColorDia(dia, '#1f2937');
              }
            }}
          >
           <h3 className="text-xs lg:text-lg font-semibold">{t(`days.${dia.toLowerCase()}`)}</h3>
          </th>
        );
      })}
    </tr>
  );
}
