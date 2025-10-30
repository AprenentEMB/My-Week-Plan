import React from 'react';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

type ExportaPDFButtonProps = {
  targetId: string;
  fileName?: string;
};

export const ExportaPDFButton: React.FC<ExportaPDFButtonProps> = ({
  targetId,
  fileName = 'taula.pdf',
}) => {
  const { t } = useTranslation();
  const handleExport = async () => {
    const node = document.getElementById(targetId);
    if (!node) {
      console.error("No s'ha trobat l'element amb id:", targetId);
      return;
    }

    try {
      // Captura la taula
      const dataUrl = await domtoimage.toPng(node, { quality: 1, bgcolor: '#fff' });

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;

        // Escala proporcional segons la dimensió més restrictiva
        const ratio = Math.min(
          (pageWidth - 2 * margin) / img.width,
          (pageHeight - 2 * margin) / img.height
        );

        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;

        // Afegeix la imatge escalada al PDF amb marge
        pdf.addImage(img, 'PNG', margin, margin, imgWidth, imgHeight);

        pdf.save(fileName);
      };
    } catch (err) {
      console.error('Error exportant PDF:', err);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1 px-2 py-1 bg-sky-800 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 hover:shadow-lg transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {t('Exporta PDF')}
    </button>
  );
};
