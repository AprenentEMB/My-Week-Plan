import { ArrowDownIcon, ArrowUpIcon } from "../icons/icons";
import { usePlanejadorStore } from "../stores/store";

export function HoraHeader() {
  const { hores, setHores } = usePlanejadorStore();

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
    <th className="w-32 border border-gray-300 bg-gray-800 p-2 text-white">
      <div className="flex items-center justify-center space-x-2">
        <button
          className="flex items-center mx-auto rounded-full p-1 hover:bg-gray-700"
          onClick={tirarHoraAmunt}
        >
          <ArrowUpIcon />
        </button>
        Hora
        <button
          className="flex items-center mx-auto rounded-full p-1 hover:bg-gray-700"
          onClick={tirarHoraAvall}
        >
          <ArrowDownIcon />
        </button>
      </div>
    </th>
  );
}
