import { useEffect, useState } from 'react';
import { useEinesStore } from '../stores/storeEines';

export const CursorFlotant = () => {
  const einaSeleccionada = useEinesStore(state => state.einaSeleccionada);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Seguim el ratolí
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Amaguem el cursor original quan hi ha eina seleccionada
  useEffect(() => {
    document.body.style.cursor = einaSeleccionada ? 'none' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [einaSeleccionada]);

  if (!einaSeleccionada) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', // perquè no bloquegi clics
        fontSize: '32px',      // mida del cursor
        zIndex: 9999,
        userSelect: 'none',
      }}
    >
      {einaSeleccionada.icona}
    </div>
  );
};
