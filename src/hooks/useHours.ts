
import { usePlanejadorStore } from '../stores/store';


export function useHours() {
  
    const hores = usePlanejadorStore((state) => state.hores);
    const setHores = usePlanejadorStore((state) => state.setHores);

    const handleDividir = (hora: string) => {

        const index = hores.indexOf(hora);
        const noveshores = [...hores];
      
        const novaHora15minuts = `${String((parseInt(hora.split(':')[0])) % 24).padStart(2, '0')}:15`;
        const novaHora30minuts = `${String((parseInt(hora.split(':')[0])) % 24).padStart(2, '0')}:30`;
        const novaHora45minuts = `${String((parseInt(hora.split(':')[0])) % 24).padStart(2, '0')}:45`;

        if (!hores.includes(novaHora30minuts) && hora.endsWith(':00')) {
            noveshores.splice(index + 1, 0, novaHora30minuts);
            setHores(noveshores);
            return;
        }
        if (!hores.includes(novaHora15minuts) && !hora.endsWith(':30') && !hora.endsWith(':45')) {
            noveshores.splice(index + 1, 0, novaHora15minuts);
        }
        if (!hores.includes(novaHora45minuts) && (hora.endsWith(':30'))) {
            noveshores.splice(index + 1, 0, novaHora45minuts);
        }
        setHores(noveshores);
    }

    const handleUnir = (hora: string) => {
        const index = hores.indexOf(hora);
        const noveshores = [...hores];
        // Funció que elimina la fila seleccionada si no és una hora sencera
        if (hora.endsWith(':15') ||hora.endsWith(':30') || hora.endsWith(':45')) {
            noveshores.splice(index, 1);
            setHores(noveshores)
        }
    }
    
    return {
        handleDividir,
        handleUnir,
    };
}
