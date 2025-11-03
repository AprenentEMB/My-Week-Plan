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
    if (!node) return;

    try {
      const dataUrl = await domtoimage.toPng(node, { quality: 1, bgcolor: undefined });
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 30;

        const scale = (pageWidth - 2 * margin) / img.width;
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;

        let y = 0;

        // mentre encara hi ha imatge per imprimir
        while (y < imgHeight) {
          const remainingHeight = imgHeight - y;
          const heightOnPage = Math.min(remainingHeight, pageHeight - 2 * margin);

          pdf.addImage(img, 'PNG', margin, margin, imgWidth, heightOnPage, undefined, 'FAST');

          y += heightOnPage;

          if (y < imgHeight) pdf.addPage(); // nova pàgina si cal
        }

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
