import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"; // component de Shadcn

type Tutorial = {
  id: string;
  titol: string;
  descripcio: string;
  url: string;
};

// Exemple: si vols, pots moure aquestes dades a un fitxer JSON i traduir els camps
const tutorials: Tutorial[] = [
  { id: "tut1", titol: "tutorial1.title", descripcio: "tutorial1.desc", url: "https://player.vimeo.com/video/XXXXXXXXX" },
  { id: "tut2", titol: "tutorial2.title", descripcio: "tutorial2.desc", url: "https://player.vimeo.com/video/YYYYYYYYY" },
  { id: "tut3", titol: "tutorial3.title", descripcio: "tutorial3.desc", url: "https://player.vimeo.com/video/ZZZZZZZZZ" },
  { id: "tut4", titol: "tutorial4.title", descripcio: "tutorial4.desc", url: "https://player.vimeo.com/video/AAAAAAA" },
  { id: "tut5", titol: "tutorial5.title", descripcio: "tutorial5.desc", url: "https://player.vimeo.com/video/BBBBBBB" },
  { id: "tut6", titol: "tutorial6.title", descripcio: "tutorial6.desc", url: "https://player.vimeo.com/video/CCCCCCC" },
];

export function SidebarLeft() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Sidebar className={`transition-all duration-300 ${collapsed ? "w-26" : "w-80"}`}>
      <SidebarHeader className="flex items-center justify-between px-2">
  {/* Indicador quan està plegat */}
  <div className="flex-1">
    {!collapsed ? (
      <h2 className="text-lg font-bold">{t("sidebar.title")}</h2>
    ) : (
      <span className="text-sm font-semibold">{t("sidebar.title")}</span>
    )}
  </div>

  {/* Botó de plegar/desplegar */}
  <Button
    variant="outline"
    size="sm"
    className="px-2 shrink-0"
    onClick={() => setCollapsed(!collapsed)}
  >
    {collapsed ? "→" : "←"}
  </Button>
</SidebarHeader>

      <SidebarContent
        className={`space-y-4 px-2 overflow-y-auto`}
        style={{ maxHeight: "calc(100vh - 6rem)" }}
      >
        {tutorials.map((tut) => (
          <SidebarGroup key={tut.id} className={`space-y-1 ${collapsed ? "hidden" : ""}`}>
            <h3 className="font-medium text-sm">{t(tut.titol)}</h3>
            <p className="text-xs text-gray-500">{t(tut.descripcio)}</p>
            <div className="aspect-video w-full rounded overflow-hidden">
              <iframe
                src={tut.url}
                title={t(tut.titol)}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className={`px-2 py-4 text-xs text-gray-400 ${collapsed ? "hidden" : ""}`}>
        {t("sidebar.footer")}
      </SidebarFooter>
    </Sidebar>
  );
}



