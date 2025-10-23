import { useState, useEffect } from "react";
import { Cella } from "./Cella";
import { useEinesStore } from "../stores/storeEines";
import { usePlanejadorStore } from "../stores/store";
import { useHours } from "../hooks/useHours";
import { formatInTimeZone } from "date-fns-tz";
import { ca } from "date-fns/locale";
import { ArrowDownIcon, ArrowUpIcon } from "../icons/icons";


const diesSetmana = [
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
  "Dissabte",
  "Diumenge",
];

export function PlanejadorSetmanal() {
  // 🔹 Estat global
  const { hores, activitats, setActivitats, setHores } = usePlanejadorStore();
  const { einaSeleccionada, setEinaSeleccionada } = useEinesStore();
  const { handleDividir, handleUnir } = useHours();

  // 🔹 Estats locals
  const [hoveredHora, setHoveredHora] = useState<string | null>(null);
  const [editant, setEditant] = useState<string | null>(null);
  const [horaActual, setHoraActual] = useState<string>("");

  // 🔹 Obté hora local exacta segons la zona de l’usuari
  useEffect(() => {
    const update = () => {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // 🕐 Formatem hora actual amb minuts exactes (HH:mm)
      const current = formatInTimeZone(new Date(), userTimeZone, "HH:mm", {
        locale: ca,
      });

      setHoraActual(current);
    };

    update(); // actualitza immediatament
    const interval = setInterval(update, 15 * 1000); // cada 15 segons
    return () => clearInterval(interval);
  }, []);

  // 🔹 Funcions d’edició
  const començarEdicio = (clau: string) => setEditant(clau);
  const guardarEdicio = (clau: string, nouValor: string) => {
    setActivitats(clau, nouValor);
    setEditant(null);
  };

  // Funció per tirar la hora de dalt a baix
  const tirarHoraAvall = () => {
    const novesHores = [...hores];
    const primeraHora = novesHores.shift();
    if (primeraHora) {
      novesHores.push(primeraHora);
      setHores(novesHores);
    }
  };

   const tirarHoraAmunt = () => {
    const novesHores = [...hores];
    const ultimaHora = novesHores.pop();
    if (ultimaHora) {
      novesHores.unshift(ultimaHora);
      setHores(novesHores);
    }
  };

  return (
    <div className="overflow-x-auto px-4 pb-14">
      <table className="w-full table-auto border-collapse mt-10 border border-gray-300">
        <thead>
          <tr>
            <th className="w-32 border border-gray-300 bg-gray-800 p-2 text-white">
              <div className="flex items-center justify-center space-x-2">
              <button className="flex items-center mx-auto rounded-full p-1 hover:bg-gray-700" onClick={tirarHoraAmunt}>
                <span className="inline-block w-4 h-4 mr-1">
                  <ArrowUpIcon />
                </span>
              </button>
              Hora
              <button className="flex items-center mx-auto rounded-full p-1 hover:bg-gray-700" onClick={tirarHoraAvall}>
                <span className="inline-block w-4 h-4 ml-1">
                  <ArrowDownIcon />
                </span>
              </button>
              </div>
            </th>
            {diesSetmana.map((dia) => (
              <th
                key={dia}
                className="w-40 min-w-[120px] border border-gray-300 bg-gray-800 p-2 text-white"
              >
                {dia}
              </th>
            ))}
          </tr>
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
    ? Number(nextHora.split(":")[0]) * 60 + Number(nextHora.split(":")[1])
    : horaEnMinuts + 60;

  const esHoraActual =
    actualEnMinuts >= horaEnMinuts && actualEnMinuts < nextEnMinuts;

  return (
    <tr key={hora} className="transition-colors duration-300">
      <td
        className={`border p-2 font-medium cursor-pointer ${
          esHoraActual ? "bg-red-200" : hoveredHora === hora ? "bg-blue-100" : ""
        }`}
        onClick={() => {
          if (einaSeleccionada) {
            if (einaSeleccionada.nom === "Parteix") {
              handleDividir(hora);
              setEinaSeleccionada(null);
            } else if (einaSeleccionada.nom === "Fusiona") {
              handleUnir(hora);
              setEinaSeleccionada(null);
            }
          }
        }}
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
Poder esborrar la linea de les 7 a les 7:30 nomes de dimarts amb la eina de la goma, la meva idea es clicar amb la gomma una cela i que el estil canvii el bg-b el color del fons de la taula per seblar que desapareixi.
*/