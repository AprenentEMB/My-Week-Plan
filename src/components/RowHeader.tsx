import { useState } from "react";
import { diesSetmana } from "../conts/dies-de-la-setmana";
import { textColorClassForBackground } from "../utils/text-color";
import { usePlanejadorStore } from "../stores/store";
import { useEinesStore } from "../stores/storeEines";
import { HoraHeader } from "./HoraHeader";

export function RowHeader() {
  const { colorEscollitTemporal } = usePlanejadorStore();
  const { einaSeleccionada } = useEinesStore();
  const [diesBackgroundColor, setDiesBackgroundColor] = useState<{
    [dia: string]: string;
  }>({});

  const setColorDia = (dia: string, color: string) =>
    setDiesBackgroundColor((prev) => ({ ...prev, [dia]: color }));


  return (
    <tr>
      <HoraHeader />

      {diesSetmana.map((dia) => {
        const bg = diesBackgroundColor[dia] ?? "#1f2937";
        const textClass = textColorClassForBackground(bg);

        return (
          <th
            key={dia}
            className={`w-40 min-w-[120px] border border-gray-300 p-2 text-center ${textClass}`}
            style={{ background: bg }}
            onClick={() => {
              if (einaSeleccionada?.nom === "Pinta" && colorEscollitTemporal) {
                setColorDia(dia, colorEscollitTemporal);
  
              }else if (einaSeleccionada?.nom === "Goma") {
                setColorDia(dia, "#1f2937");
              }
            }}
          >
            {dia}
          </th>
        );
      })}
    </tr>
  );
}
