import { usePlanejadorStore } from '../stores/store';

export function useHours() {
  const hores = usePlanejadorStore(state => state.hores);
  const setHores = usePlanejadorStore(state => state.setHores);

  const handleDividir = (hora: string) => {
    const index = hores.indexOf(hora);
    const noveshores = [...hores];

    const horaActual = parseInt(hora.split(':')[0]);
    const novaHora15minuts = `${String(horaActual % 24).padStart(2, '0')}:15`;
    const novaHora30minuts = `${String(horaActual % 24).padStart(2, '0')}:30`;
    const novaHora45minuts = `${String(horaActual % 24).padStart(2, '0')}:45`;

    // Calcular la següent hora sencera
    const horaSeguent = (horaActual + 1) % 24;
    const novaHoraSencera = `${String(horaSeguent).padStart(2, '0')}:00`;

    // 🧠 Nou comportament: si cliquem dividir a una hora sencera
    if (hora.endsWith(':00')) {
      // Si NO existeix la següent hora sencera → afegeix-la
      if (!hores.includes(novaHoraSencera)) {
        noveshores.splice(index + 1, 0, novaHoraSencera);
        setHores(noveshores);
        return;
      }
      // Si SÍ existeix, segueix la lògica original de quarts/mitges hores
      else if (!hores.includes(novaHora30minuts) && !hores.includes(novaHora15minuts)) {
        noveshores.splice(index + 1, 0, novaHora30minuts);
        setHores(noveshores);
        return;
      } else if (hores.includes(novaHora15minuts) && !hores.includes(novaHora30minuts)) {
        noveshores.splice(index + 2, 0, novaHora30minuts);
        setHores(noveshores);
        return;
      }
    }

    if (hora.endsWith(':15')) {
      // Si NO existeix la següent mitja hora → afegeix-la
      if (!hores.includes(novaHora30minuts)) {
        noveshores.splice(index + 1, 0, novaHora30minuts);
        setHores(noveshores);
        return;
      }
    }

    // 🔹 Si no és una hora sencera, continua amb la lògica habitual
    if (!hores.includes(novaHora15minuts) && !hora.endsWith(':30') && !hora.endsWith(':45')) {
      noveshores.splice(index + 1, 0, novaHora15minuts);
    }
    if (!hores.includes(novaHora45minuts) && hora.endsWith(':30')) {
      noveshores.splice(index + 1, 0, novaHora45minuts);
    }

    setHores(noveshores);
  };

  const handleUnir = (hora: string) => {
    const index = hores.indexOf(hora);
    if (index === -1) return;

    const noveshores = [...hores];

    // 🧠 Si és una fracció (15, 30 o 45), elimina només aquesta
    if (hora.endsWith(':15') || hora.endsWith(':30') || hora.endsWith(':45')) {
      noveshores.splice(index, 1);
    }
    // 🕒 Si és una hora sencera (:00), elimina-la també
    else if (hora.endsWith(':00')) {
      noveshores.splice(index, 1);
    }

    setHores(noveshores);
  };

  return {
    handleDividir,
    handleUnir,
  };
}
