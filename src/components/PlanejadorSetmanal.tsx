import { useState } from "react";
import { useEinesStore } from "../stores/storeEines";
import { usePlanejadorStore } from "../stores/store";
import { useHours } from "../hooks/useHours";
import { ca } from "date-fns/locale";
import { useHoraActual } from "../utils/hora-actual";
import { Cella } from "./Cella";
import { RowHeader } from "./RowHeader";
import { textColorClassForBackground } from "../utils/text-color";
import { diesSetmana } from "../conts/dies-de-la-setmana";

export function PlanejadorSetmanal() {
  const { hores, activitats, setActivitats, generaBackgroundColor } =
    usePlanejadorStore();
  const { einaSeleccionada, setEinaSeleccionada } = useEinesStore();
  const { handleDividir, handleUnir } = useHours();

  const [hoveredHora, setHoveredHora] = useState<string | null>(null);
  const [editant, setEditant] = useState<string | null>(null);

  const horaActual = useHoraActual({
    intervalMs: 15_000,
    format: "HH:mm",
    locale: ca,
  });

  const començarEdicio = (clau: string) => setEditant(clau);
  const guardarEdicio = (clau: string, nouValor: string) => {
    setActivitats(clau, nouValor);
    setEditant(null);
  };
  const handleJoinOrDivide = (hora: string) => {
    if (einaSeleccionada) {
      if (einaSeleccionada.nom === "Parteix") {
        handleDividir(hora);
        setEinaSeleccionada(null);
      } else if (einaSeleccionada.nom === "Fusiona") {
        handleUnir(hora);
        setEinaSeleccionada(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto px-4 pb-14">
      <table className="w-full table-auto border-collapse mt-10 border border-gray-300">
        <thead>
          <RowHeader />
        </thead>

        <tbody>
          {hores.map((hora) => {
            const [h, m] = hora.split(":").map(Number);
            const [hc, mc] = horaActual.split(":").map(Number);

            const horaEnMinuts = h * 60 + m;
            const actualEnMinuts = hc * 60 + mc;

            const index = hores.indexOf(hora);
            const nextHora = hores[index + 1];
            const nextEnMinuts = nextHora
              ? Number(nextHora.split(":")[0]) * 60 +
                Number(nextHora.split(":")[1])
              : horaEnMinuts + 60;

            const esHoraActual =
              actualEnMinuts >= horaEnMinuts && actualEnMinuts < nextEnMinuts;

            const cellBgHex = esHoraActual
              ? "#fecaca"
              : hoveredHora === hora
              ? "#dbeafe"
              : generaBackgroundColor ?? "#ffffff";

            const textColorClass = textColorClassForBackground(cellBgHex);

            return (
              <tr key={hora} className="transition-colors duration-300">
                <td
                  className={`border p-2 font-medium cursor-pointer ${textColorClass} ${
                    esHoraActual
                      ? "bg-red-200"
                      : hoveredHora === hora
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleJoinOrDivide(hora)}
                  onMouseEnter={() => setHoveredHora(hora)}
                  onMouseLeave={() => setHoveredHora(null)}
                  title="Fes clic per aplicar l’eina seleccionada"
                >
                  {hora}
                </td>

                {diesSetmana.map((dia) => {
                  const clau = `${dia}-${hora}`;
                  const estaEditant = editant === clau;

                  return (
                    <Cella
                      key={clau}
                      clau={clau}
                      estaEditant={estaEditant}
                      valor={activitats[clau] || ""}
                      començarEdicio={començarEdicio}
                      guardarEdicio={guardarEdicio}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

      


/*
Borrar els colors dels dies de la setmana
Repasar formulari
Afegir tipos com a eina
Afegir validacions al formulari
Afegir missatges d'error al formulari
Afegir botó per esborrar tot el planificador amb confirmador
*/