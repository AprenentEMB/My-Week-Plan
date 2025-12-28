import React from 'react';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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

        while (y < imgHeight) {
          const remainingHeight = imgHeight - y;
          const heightOnPage = Math.min(remainingHeight, pageHeight - 2 * margin);

          pdf.addImage(img, 'PNG', margin, margin, imgWidth, heightOnPage, undefined, 'FAST');

          y += heightOnPage;

          if (y < imgHeight) pdf.addPage();
        }

        pdf.save(fileName);
      };
    } catch (err) {
      console.error('Error exportant PDF:', err);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline" // ShadCN variants: 'default', 'outline', 'ghost', etc.
      size="sm"
      className="
  flex items-center gap-2
  bg-indigo-600 hover:bg-indigo-700
  text-white
  px-3 py-2
  rounded-md
  shadow-sm hover:shadow-md
  transition-colors
"
    >
      <Download className="h-4 w-4" />
      {t('Exporta PDF')}
    </Button>
  );
};
