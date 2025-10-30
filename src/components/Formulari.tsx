import { useState, useEffect } from 'react';
import { usePlanejadorStore } from '../stores/store';
import { useEinesStore } from '../stores/storeEines';
import { diesSetmana } from '../const/dies-de-la-setmana';

export function FormulariActivitat() {
  const { hores, setActivitats } = usePlanejadorStore();
  const { setEinaSeleccionada } = useEinesStore();

  const [diesSeleccionats, setDiesSeleccionats] = useState<string[]>([]);
  const [horaInici, setHoraInici] = useState<string>(hores[0]);
  const [horaFi, setHoraFi] = useState<string>(hores[1]);
  const [activitat, setActivitat] = useState<string>('');

  useEffect(() => {
    const indexInici = hores.indexOf(horaInici);
    const indexFi = hores.indexOf(horaFi);

    // Si l'hora de fi és abans o igual que la d'inici, la posem una hora més tard
    if (indexFi <= indexInici && indexInici < hores.length - 1) {
      setHoraFi(hores[indexInici + 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horaInici, hores]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const indexInici = hores.indexOf(horaInici);
    const indexFi = hores.indexOf(horaFi);

    if (indexInici === -1 || indexFi === -1 || indexFi <= indexInici) {
      alert("L'interval d'hores no és vàlid!");
      return;
    }

    if (diesSeleccionats.length === 0) {
      alert('Selecciona almenys un dia!');
      return;
    }

    // Afegeix l’activitat a cada dia seleccionat i cada hora dins l’interval
    diesSeleccionats.forEach(dia => {
      for (let i = indexInici; i < indexFi; i++) {
        const clau = `${dia}-${hores[i]}`;
        setActivitats(clau, activitat);
      }
    });

    // Reinicia estat
    setEinaSeleccionada(null);
    setActivitat('');
    setDiesSeleccionats([]);
  };

  const toggleDia = (dia: string) => {
    setDiesSeleccionats(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-4 bg-gray-700 p-4 rounded-md"
    >
      {/* Dies de la setmana */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Dies</label>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {diesSetmana.map(d => (
            <label
              key={d}
              className={`flex items-center justify-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded cursor-pointer transition-all text-sm md:text-base
          ${
            diesSeleccionats.includes(d)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
            >
              <input
                type="checkbox"
                value={d}
                checked={diesSeleccionats.includes(d)}
                onChange={() => toggleDia(d)}
                className="hidden"
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      {/* Hora inici */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Des de</label>
        <select
          value={horaInici}
          onChange={e => setHoraInici(e.target.value)}
          className="border p-2 rounded"
        >
          {hores.map(h => (
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
          onChange={e => setHoraFi(e.target.value)}
          className="border p-2 rounded"
        >
          {hores.map(h => (
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
          onChange={e => setActivitat(e.target.value)}
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
