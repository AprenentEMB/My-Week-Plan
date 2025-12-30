
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePlanejadorStore } from '@/stores/store';



export type ExportaPDFButtonProps = {
  targetId: string;
  fileName?: string;
  setCoffeeModalVisible: (visible: boolean) => void;
};

export const ExportaPDFButton: React.FC<ExportaPDFButtonProps> = ({
  targetId,
  fileName = 'taula.pdf',
  setCoffeeModalVisible
}) => {
  const { setExportantPDF } = usePlanejadorStore();
  

  const handleExport = async () => {
    const node = document.getElementById(targetId);
    if (!node) return;

    try {
      setExportantPDF(true);
      await new Promise((r) => setTimeout(r, 150));

      const actualWidth = node.scrollWidth;
      const actualHeight = node.scrollHeight + 40;

      const options = {
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

      // Typed wrapper for dom-to-image-more to avoid using `any`
      type DomToImageOptions = {
        width?: number;
        height?: number;
        style?: Record<string, string>;
        bgcolor?: string;
        [key: string]: unknown;
      };

      type DomToImage = {
        toPng(node: HTMLElement | Element, options?: DomToImageOptions): Promise<string>;
      };

      const domToImageTyped = domtoimage as unknown as DomToImage;
      const dataUrl = await domToImageTyped.toPng(node as HTMLElement, options);
      const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const printableWidth = pageWidth - margin * 2;
      const scale = printableWidth / actualWidth;
      const imgWidthInPdf = actualWidth * scale;
      const imgHeightInPdf = actualHeight * scale;

      let heightLeft = imgHeightInPdf;
      let position = margin;

      pdf.addImage(dataUrl, 'PNG', margin, position, imgWidthInPdf, imgHeightInPdf, undefined, 'FAST');
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = heightLeft - imgHeightInPdf + margin;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', margin, position, imgWidthInPdf, imgHeightInPdf, undefined, 'FAST');
        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save(fileName);
      setExportantPDF(false);

      setTimeout(() => {
        setCoffeeModalVisible(true);
      }, 50);
    } catch (err) {
      console.error('Error exportant PDF:', err);
      setExportantPDF(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleExport}
        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-md"
      >
        <Download className="h-4 w-4" />
        Exporta PDF
      </Button>

      
    </>
  );
};

