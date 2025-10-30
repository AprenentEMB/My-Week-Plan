import { useState, useMemo } from 'react';
import { useEinesStore } from '../stores/storeEines';
import { usePlanejadorStore } from '../stores/store'; // ajusta la ruta si cal
import { palette } from '../const/paleta'; // defineix una paleta de colors aquí o importa-la des d'un altre lloc
import { fonts } from '../const/fonts';
import { textColorClassForBackground } from '../utils/text-color';
import { ArrowDownIcon, ArrowUpIcon } from '../icons/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';


export function Eines() {
  const { t } = useTranslation();
  const { einesDisponibles, einaSeleccionada, setEinaSeleccionada } = useEinesStore();
  const {
    colorEscollitTemporal,
    setColorEscollitTemporal,
    setFontFamily,
    generalBackgroundColor,
    setResetPlanejador,
    setGeneralBackgroundColor,
    rellotgeActiu,
    setRellotgeActiu,
  } = usePlanejadorStore();
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [obreConfirmacioReset, setObreConfirmacioReset] = useState(false);
  const [obreModalComFunciona, setObreModalComFunciona] = useState(false);

  const handleEinaClick = (eina: { id: string; nom: string; icona: string }) => {
    if (eina.id === "leaveTool") {
      // desselecciona qualsevol eina activa
      setEinaSeleccionada(null);
      setColorEscollitTemporal('');
      return;
    }
    if (eina.id === 'form') {
      // obre el formulari d'activitats
      setEinaSeleccionada(eina);

      return;
    }
    if (eina.id === 'paint') {
      // obre el selector de color directament
      setOpenColorPicker(true);
      setEinaSeleccionada(eina);
    } else {
      // per altres eines, només selecciona o desselecciona
      setOpenColorPicker(false);
      setEinaSeleccionada(einaSeleccionada?.id === eina.id ? null : eina);
    }
    if (eina.id === 'undo') {
      usePlanejadorStore.getState().desferAccio();
      setEinaSeleccionada(null);
      return;
    }
    if (eina.id === 'redo') {
      usePlanejadorStore.getState().referAccio();
      setEinaSeleccionada(null);
      return;
    }
    if (eina.id === 'reset') {
      setEinaSeleccionada(null);
      setObreConfirmacioReset(true);
      return;
    }
    if (eina.id === 'howItWorks') {
    
      setObreModalComFunciona(true);
    }
    if (eina.id === 'clock') {
      setRellotgeActiu(!rellotgeActiu);
    }
  };

  const handleColorClick = (color: string) => () => {
    setColorEscollitTemporal(color);
    setOpenColorPicker(false);
  };

  const handleFontClick = (font: string) => () => {
    setFontFamily(font);
    setEinaSeleccionada(null);
  };

  const textColorClass = useMemo(
    () => textColorClassForBackground(generalBackgroundColor),
    [generalBackgroundColor]
  );

  const handleResetPlanejador = () => {
    setResetPlanejador();
    setObreConfirmacioReset(false);
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 ${textColorClass}`}
      onClick={() => {
        if (einaSeleccionada?.id === 'paint') {
          setGeneralBackgroundColor(colorEscollitTemporal || 'white');
        }
      }}
    >
      <div className="flex space-x-2 justify-center mt-4" onClick={e => e.stopPropagation()}>
        {einesDisponibles.map(eina => (
          <motion.div key={eina.id} className="flex flex-col items-center gap-3" whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}>
            <button
              className={`w-15 h-15 flex items-center justify-center rounded-full border transition-colors ${
                einaSeleccionada?.id === eina.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black'
              }`}
              onClick={() => handleEinaClick(eina)}
              type="button"
            >
              <span className="text-2xl leading-none">{eina.icona}</span>
            </button>
            <div className="text-xs text-center px-1">{eina.nom}</div>
          </motion.div>
        ))}
      </div>

      {/* Modal central per a l'eina "Pinta" */}
      {openColorPicker && einaSeleccionada?.id === 'paint' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick= {() => setOpenColorPicker(false)}
        >
          <div
            className="w-full max-w-md p-4 bg-white rounded shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">
                Tria color per pintar (s'utilitzarà en el següent clic):
              </div>
              <button
                aria-label="Tanca"
                onClick={() => {
                  setOpenColorPicker(false);
                  setEinaSeleccionada(null);
                }}
                className="text-gray-600 hover:text-gray-900 ml-2"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {palette.map(c => (
                <button
                  key={c}
                  aria-label={`Selecciona ${c}`}
                  title={c}
                  onClick={handleColorClick(c)}
                  className={`w-8 h-8 rounded border ${colorEscollitTemporal === c ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                  style={{ background: c }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Modal central per a l'eina "Tipografia" */}
      {einaSeleccionada?.id === 'font' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-slate-200/70"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md p-4 rounded shadow-lg max-h-[80vh] overflow-y-auto bg-slate-400/70"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 sticky top-0  z-10 pb-2">
              <button
                aria-label="Tanca"
                onClick={() => {
                  setOpenColorPicker(false);
                  setEinaSeleccionada(null);
                }}
                className="text-gray-300 hover:text-white ml-2"
                type="button"
              >
                <span className="relative text-gray-300 hover:text-white ml-2 w-7 h-7">×</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {fonts.map(font => (
                <button
                  key={font.name}
                  aria-label={`Selecciona ${font.name}`}
                  title={font.name}
                  onClick={handleFontClick(font.css)}
                  className={`w-full text-left px-4 py-2 rounded border transition-colors ${
                    colorEscollitTemporal === font.css
                      ? 'ring-2 ring-offset-1 ring-blue-500'
                      : 'hover:bg-slate-600'
                  }`}
                  style={{ fontFamily: font.css }}
                  type="button"
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmació per a l'eina "Reset" */}
      {obreConfirmacioReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md p-4 bg-white rounded shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-3">
              <div className="text-lg font-medium">{t('resetConfirmation.title')}</div>
              <div className="text-sm text-gray-600 mt-2">
                {t('resetConfirmation.message')}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setObreConfirmacioReset(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                type="button"
              >
                {t('resetConfirmation.cancel')}
              </button>
              <button
                onClick={handleResetPlanejador}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                type="button"
              >
                {t('resetConfirmation.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de "Com funciona?" */}
      {obreModalComFunciona && (
        <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl p-6 bg-white rounded shadow-lg max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-medium">{t('howItWorks.title')}</div>
          <button
            aria-label={t('howItWorks.close')}
            onClick={() => {
              setObreModalComFunciona(false);
              setEinaSeleccionada(null);
            }}
            className="text-gray-600 hover:text-gray-900 ml-2"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Contingut */}
        <div className="text-sm text-gray-700 space-y-4">
          <p>{t('howItWorks.intro')}</p>

          <p>
            <strong>{t('howItWorks.toolsTitle')}</strong>
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li className="flex items-start gap-2">
              <span>✂️</span>
              <span>
                <strong>{t('howItWorks.tools.split.title')}:</strong> {t('howItWorks.tools.split.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔗</span>
              <span>
                <strong>{t('howItWorks.tools.merge.title')}:</strong> {t('howItWorks.tools.merge.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>🧽</span>
              <span>
                <strong>{t('howItWorks.tools.erase.title')}:</strong> {t('howItWorks.tools.erase.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔤</span>
              <span>
                <strong>{t('howItWorks.tools.font.title')}:</strong> {t('howItWorks.tools.font.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>🎨</span>
              <span>
                <strong>{t('howItWorks.tools.paint.title')}:</strong> {t('howItWorks.tools.paint.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>➕</span>
              <span>
                <strong>{t('howItWorks.tools.addActivity.title')}:</strong> {t('howItWorks.tools.addActivity.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>✋</span>
              <span>
                <strong>{t('howItWorks.tools.leaveTool.title')}:</strong> {t('howItWorks.tools.leaveTool.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>↩️</span>
              <span>
                <strong>{t('howItWorks.tools.undo.title')}:</strong> {t('howItWorks.tools.undo.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>↪️</span>
              <span>
                <strong>{t('howItWorks.tools.redo.title')}:</strong> {t('howItWorks.tools.redo.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔄</span>
              <span>
                <strong>{t('howItWorks.tools.reset.title')}:</strong> {t('howItWorks.tools.reset.desc')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>
                <span className="w-4 h-4 inline"><ArrowDownIcon /></span> Hora <span className="w-4 h-4 inline"><ArrowUpIcon /></span>
              </span>
              <span>
                <strong>{t('howItWorks.tools.moveHours.title')}:</strong> {t('howItWorks.tools.moveHours.desc')}
              </span>
            </li>
          </ul>

          <p>{t('howItWorks.outro')}</p>
        </div>
      </div>
    </div>
      )}
    </div>
  );
}
