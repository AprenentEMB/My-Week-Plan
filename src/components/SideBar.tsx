import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Player from '@vimeo/player';

type Tutorial = {
  id: string;
  titol: string;
  descripcio: string;
  url: string;
  thumbnail: string;
};

const tutorials: Tutorial[] = [
  {
    id: 'tut1',
    titol: 'tutorial1.title',
    descripcio: 'tutorial1.desc',
    url: 'https://player.vimeo.com/video/1150106468?h=714aba8d86&title=0&byline=0&portrait=0',
    thumbnail: '/1.png',
  },
  {
    id: 'tut2',
    titol: 'tutorial2.title',
    descripcio: 'tutorial2.desc',
    url: 'https://player.vimeo.com/video/1150106494?h=1fba5f3510',
    thumbnail: '/2.png',
  },
  {
    id: 'tut3',
    titol: 'tutorial3.title',
    descripcio: 'tutorial3.desc',
    url: 'https://player.vimeo.com/video/1150106510?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    thumbnail: '/3.png',
  },
  {
    id: 'tut4',
    titol: 'tutorial4.title',
    descripcio: 'tutorial4.desc',
    url: 'https://player.vimeo.com/video/1150106526?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    thumbnail: '/4.png',
  },
  {
    id: 'tut5',
    titol: 'tutorial5.title',
    descripcio: 'tutorial5.desc',
    url: 'https://player.vimeo.com/video/1150106540?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    thumbnail: '/5.png',
  },
  {
    id: 'tut6',
    titol: 'tutorial6.title',
    descripcio: 'tutorial6.desc',
    url: 'https://player.vimeo.com/video/1150106559?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    thumbnail: '/6.png',
  },
  {
    id: 'tut7',
    titol: 'tutorial7.title',
    descripcio: 'tutorial7.desc',
    url: 'https://player.vimeo.com/video/1150106575?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    thumbnail: '/7.png',
  },
  {
    id: 'tut8',
    titol: 'tutorial8.title',
    descripcio: 'tutorial8.desc',
    url: 'https://player.vimeo.com/video/1150106589?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    thumbnail: '/8.png',
  },
  {
    id: 'tut9',
    titol: 'tutorial9.title',
    descripcio: 'tutorial9.desc',
    url: 'https://player.vimeo.com/video/1150219856?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
    thumbnail: '/9.png',
  }
];

export function SidebarLeft() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [ended, setEnded] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Si no hi ha tutorial o l'iframe encara no s'ha renderitzat, sortim
    if (!activeTutorial || !open) return;

    // Donem un petit respir perquè React munti l'iframe al DOM
    const timeoutId = setTimeout(() => {
      if (iframeRef.current) {
        const player = new Player(iframeRef.current);

        player.on('ended', () => {
          setEnded(true);
        });

        // Neteja quan el component es desmunta o canvia el tutorial
        return () => {
          player.unload();
          player.destroy();
        };
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activeTutorial, open]);

  return (
    <Sidebar className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'}`}>
      <SidebarHeader className="flex items-center justify-between px-2">
        <div className="flex-1">
          {!collapsed ? (
            <h2 className="text-lg font-bold">{t('sidebar.title')}</h2>
          ) : (
            <span className="text-sm font-semibold">{t('sidebar.title')}</span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="px-2 shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </Button>
      </SidebarHeader>

      <SidebarContent
        className="space-y-4 px-2 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 6rem)' }}
      >
        {tutorials.map(tut => (
          <SidebarGroup key={tut.id} className={`space-y-2 ${collapsed ? 'hidden' : ''}`}>
            <h3 className="font-medium text-sm">{t(tut.titol)}</h3>
            <p className="text-xs text-gray-500">{t(tut.descripcio)}</p>

            {/* Preview en comptes del botó */}
            <div
              className="relative w-full aspect-video rounded overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105"
              onClick={() => {
                setActiveTutorial(tut);
                setEnded(false);
                setOpen(true);
              }}
            >
              <img src={tut.thumbnail} alt={t(tut.titol)} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <svg
                  className="w-12 h-12 text-white animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <Dialog
        open={open}
        onOpenChange={isOpen => {
          setOpen(isOpen);
          if (!isOpen) {
            setActiveTutorial(null);
            setEnded(false);
          }
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none">
          {activeTutorial && (
            <>
              <DialogHeader className="p-4 bg-white">
                <DialogTitle>{t(activeTutorial.titol)}</DialogTitle>
              </DialogHeader>

              <div className="relative w-full aspect-video bg-black">
                <iframe
                  key={activeTutorial.id}
                  ref={iframeRef}
                  src={`${activeTutorial.url}&autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />

                {/* TELA NEGRA FINAL */}
                {ended && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 transition-opacity duration-300">
                    <p className="text-white mb-6 text-lg font-medium">Has acabat el tutorial</p>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setOpen(false)}
                      className="cursor-pointer"
                    >
                      Tancar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SidebarFooter className={`px-2 py-4 text-xs text-gray-400 ${collapsed ? 'hidden' : ''}`}>
        {t('sidebar.footer')}
      </SidebarFooter>
    </Sidebar>
  );
}
