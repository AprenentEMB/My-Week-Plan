import React from 'react';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePlanejadorStore } from '@/stores/store';

type ExportaPDFButtonProps = {
  targetId: string;
  fileName?: string;
};

export const ExportaPDFButton: React.FC<ExportaPDFButtonProps> = ({
  targetId,
  fileName = 'taula.pdf',
}) => {
  const { setExportantPDF } = usePlanejadorStore();
  const { t } = useTranslation();

const handleExport = async () => {
  const node = document.getElementById(targetId);
  if (!node) return;

  try {
    setExportantPDF(true);
    // Temps per treure animacions i mostrar contingut pur
    await new Promise((r) => setTimeout(r, 150));

    // 1. Dimensions reals (scrollWidth agafa tota la taula encara que no es vegi)
    const actualWidth = node.scrollWidth;
    const actualHeight = node.scrollHeight + 40;
// 1. Definim com hauria de ser realment la interfície de la llibreria
interface FixedDomToImageOptions {
  width?: number;
  height?: number;
  bgcolor?: string;
  style?: Partial<CSSStyleDeclaration>; // Aquí corregim el 'string' per l'objecte
  quality?: number;
  cacheBust?: boolean;
  imagePlaceholder?: string;
}

// 2. Apliquem el tipus en el moment de la crida
const options: FixedDomToImageOptions = {
  width: actualWidth,
  height: actualHeight + 20,
  style: {
    transform: 'scale(1)',
    transformOrigin: 'top left',
    width: `${actualWidth}px`,
    height: `${actualHeight}px`,
    margin: '0',
  },
  bgcolor: '#ffffff',
};

// 3. Usem 'as unknown' per tipar només la funció que cridem i evitar 'any'
const domToImageWithTypes = domtoimage as unknown as {
  toPng: (node: HTMLElement | Element, options?: FixedDomToImageOptions) => Promise<string>;
};
const dataUrl = await domToImageWithTypes.toPng(node, options);

    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      // Forcem 'p' (portrait) i 'a4'
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 20; // Marges laterals
      const printableWidth = pageWidth - (margin * 2);
      
      // Calculem l'escala perquè l'AMPLADA de la taula sigui l'AMPLADA del paper
      const scale = printableWidth / actualWidth;
      const imgWidthInPdf = actualWidth * scale;
      const imgHeightInPdf = actualHeight * scale;

      let heightLeft = imgHeightInPdf;
      let position = margin;

      // Afegim la primera pàgina (ajustada a l'amplada)
      pdf.addImage(dataUrl, 'PNG', margin, position, imgWidthInPdf, imgHeightInPdf, undefined, 'FAST');
      
      // Si el contingut és més llarg que el foli verticalment, afegim pàgines
      heightLeft -= (pageHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeightInPdf + margin;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', margin, position, imgWidthInPdf, imgHeightInPdf, undefined, 'FAST');
        heightLeft -= (pageHeight - margin * 2);
      }

      pdf.save(fileName);
      setExportantPDF(false);
    };
  } catch (err) {
    console.error('Error exportant PDF:', err);
    setExportantPDF(false);
  }
};

  return (
    <Button
      onClick={handleExport}
      variant="outline" // ShadCN variants: 'default', 'outline', 'ghost', etc.
      size="sm"
      className="
  flex items-center gap-2
  bg-teal-600 hover:bg-teal-700
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
