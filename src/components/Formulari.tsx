import { useState } from "react";
import { usePlanejadorStore } from "../stores/store";
import { useEinesStore } from "../stores/storeEines";
import { diesSetmana } from "../conts/dies-de-la-setmana"; // pots exportar-lo d'allà o tornar-lo a definir

export function FormulariActivitat() {
  const { hores, setActivitats } = usePlanejadorStore();
  const [dia, setDia] = useState<string>("Dilluns");
  const { setEinaSeleccionada } = useEinesStore();
  const [horaInici, setHoraInici] = useState<string>(hores[0]);
  const [horaFi, setHoraFi] = useState<string>(hores[1]);
  const [activitat, setActivitat] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const indexInici = hores.indexOf(horaInici);
    const indexFi = hores.indexOf(horaFi);

    if (indexInici === -1 || indexFi === -1 || indexFi < indexInici) {
      alert("L'interval d'hores no és vàlid!");
      return;
    }

    // Afegeix l’activitat a totes les hores de l’interval seleccionat
    for (let i = indexInici; i < indexFi; i++) {
      const clau = `${dia}-${hores[i]}`;
      setActivitats(clau, activitat);
    }
    setEinaSeleccionada(null);
    // Neteja el formulari
    setActivitat("");

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-4 bg-gray-700 p-4 rounded-md"
    >
        
      {/* Dia de la setmana */}
      <div className="flex flex-col">
        
        <label className="text-sm font-medium mb-1">Dia</label>
        <select
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          className="border p-2 rounded"
        >
          {diesSetmana.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Hora inici */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Des de</label>
        <select
          value={horaInici}
          onChange={(e) => setHoraInici(e.target.value)}
          className="border p-2 rounded"
        >
          {hores.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Hora final */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Fins</label>
        <select
          value={horaFi}
          onChange={(e) => setHoraFi(e.target.value)}
          className="border p-2 rounded"
        >
          {hores.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Activitat */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-1">Activitat</label>
        <input
          type="text"
          value={activitat}
          onChange={(e) => setActivitat(e.target.value)}
          placeholder="Escriu l'activitat..."
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Afegir
      </button>
    </form>
  );
}

