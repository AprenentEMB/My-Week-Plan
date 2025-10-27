import { useState, useEffect } from "react";
import { formatInTimeZone } from "date-fns-tz";
import type { Locale } from "date-fns";

type Options = {
  intervalMs?: number;
  format?: string;
  locale?: Locale;
};

/**
 * Retorna una string amb l'hora actual actualitzada cada `intervalMs`.
 * Per defecte format "HH:mm" i interval 15000ms.
 */
export function useHoraActual({ intervalMs = 15000, format = "HH:mm", locale }: Options = {}) {
  const [hora, setHora] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const opts: { locale?: Locale } | undefined = locale ? { locale } : undefined;
      const current = formatInTimeZone(new Date(), tz, format, opts);
      setHora(current);
    };

    update();
    const id = setInterval(update, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, format, locale]);

  return hora;
}