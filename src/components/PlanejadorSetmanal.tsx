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
  const hores = usePlanejadorStore((state) => state.hores);
const activitats = usePlanejadorStore((state) => state.activitats);
const setActivitats = usePlanejadorStore((state) => state.setActivitats);
const generalBackgroundColor = usePlanejadorStore((state) => state.generalBackgroundColor);

  const { einaSeleccionada} = useEinesStore();
  const { handleDividir, handleUnir } = useHours();
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
      } else if (einaSeleccionada.nom === "Fusiona") {
        handleUnir(hora);
      }
    }
  };



  return (
    <div
  id="taula-horari"
  className="overflow-auto rounded-md shadow-lg p-6 pb-20 mb-3"

  
>
      <table className="w-full table-auto border-collapse border border-gray-300 overflow-x-auto block sm:table"
      style={{ backgroundColor: generalBackgroundColor }}>

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
             


            const textColorClass = esHoraActual? 'text-slate-700' : textColorClassForBackground(generalBackgroundColor);

            const horaClasses = [
  'border',
  'p-2',
  'font-medium',
  'cursor-pointer',
  textColorClass, // variable externa
  esHoraActual
    ? 'bg-blue-100 border-blue-500 shadow-md text-slate-700'
    : 'bg-transparent'
].join(' ');


           

            return (
              <tr key={hora} className="transition-colors duration-300">
                <td
                  className={horaClasses}
                 

                  onClick={() => handleJoinOrDivide(hora)}
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

Que quan toquis A QUALSEVOL PUNT DEL FONS ES PINTI

Acabar d'explicar utilitats com que es marca la hora actual i que es pot desplaçar les hores amb les fletxes

Poder activar o desactivar la visualització de la hora actual

Fer que reaccioni al bg tambe els bordes de les celes o que sempre sigui visible

al formulari si poses una hora de començar que automaticament et posi la de final 1 hora després

Afegir Animacions a les files i cel·les quan canvia el color de fons o quan es fusionen o divideixen les celes o les hores 

*/